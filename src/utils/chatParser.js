/**
 * Parses raw WhatsApp chat export text and extracts structured messages.
 * Handles iOS, Android, 12-hour, 24-hour, and multi-line formats.
 */

// Normalizes special hidden characters often inserted in WhatsApp exports
function cleanString(str) {
  return str
    .replace(/[\u200e\u200f\u202f\u200b]/g, '') // remove invisible markers and narrow spaces
    .trim();
}

/**
 * Automatically detects whether the date format is DD/MM/YY or MM/DD/YY.
 * Scans lines to see if the first or second number exceeds 12.
 */
function detectDateFormat(lines) {
  const dateRegex = /(\d{1,4})[/\-.](\d{1,2})[/\-.](\d{1,4})/;
  
  for (let line of lines) {
    const cleanLine = cleanString(line);
    const match = cleanLine.match(dateRegex);
    if (match) {
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);
      
      // If the first part is > 12, it must be the day, so DD/MM/YY
      if (p1 > 12 && p1 <= 31) {
        return 'DD/MM/YY';
      }
      // If the second part is > 12, it must be the day, so MM/DD/YY
      if (p2 > 12 && p2 <= 31) {
        return 'MM/DD/YY';
      }
    }
  }
  
  // Default to DD/MM/YY (common in Europe, India, etc., matching the user's "16/04/26" for April 16th)
  return 'DD/MM/YY';
}

export function parseChat(rawText) {
  if (!rawText) return { messages: [], participants: [] };

  const lines = rawText.split(/\r?\n/);
  const dateFormat = detectDateFormat(lines.slice(0, 500));
  
  const parsedMessages = [];
  const participantsSet = new Set();

  // Regex patterns (using case-insensitive flags where necessary):
  // 1. Android style: 16/04/26, 12:26 am - Name: Message
  const androidRegex = /^(\d{1,4}[/\-.]\d{1,2}[/\-.]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*[a-zA-Z\s\.]+)\s*-\s*([^:]+):\s*(.*)$/i;
  
  // 2. iOS style: [16/04/26, 12:26:20 am] Name: Message
  const iosRegex = /^\[?(\d{1,4}[/\-.]\d{1,2}[/\-.]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*[a-zA-Z\s\.]+)\]\s+([^:]+):\s*(.*)$/i;

  // 3. 24-Hour / standard format (no am/pm): 16/04/26, 12:26 - Name: Message
  const standard24Regex = /^(\d{1,4}[/\-.]\d{1,2}[/\-.]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$/;
  const ios24Regex = /^\[?(\d{1,4}[/\-.]\d{1,2}[/\-.]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+([^:]+):\s*(.*)$/;

  let lastMessage = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = cleanString(rawLine);
    if (!line) continue;

    let match = line.match(androidRegex);
    if (!match) match = line.match(iosRegex);
    if (!match) match = line.match(standard24Regex);
    if (!match) match = line.match(ios24Regex);

    if (match) {
      // It's a new message
      const dateStr = match[1];
      const timeStr = cleanString(match[2]);
      const sender = cleanString(match[3]);
      const content = match[4] ? match[4].trim() : '';

      // Skip system messages like security code changes, groups joined, etc.
      // A sender name shouldn't contain phrases like "added", "created", "left", etc., if they have no colon separator
      if (sender.toLowerCase().includes('changed your security code') || 
          sender.toLowerCase().includes('messages and calls are end-to-end encrypted')) {
        continue;
      }

      // Parse date and time
      const dateObj = parseDateTime(dateStr, timeStr, dateFormat);
      if (!dateObj) continue; // Invalid date

      participantsSet.add(sender);

      lastMessage = {
        date: dateObj,
        sender,
        content,
        isMedia: checkMedia(content) || content.trim() === '',
        isViewOnce: content.trim() === '',
        isDeleted: checkDeleted(content),
        linksCount: countLinks(content),
        wordsCount: content ? content.split(/\s+/).filter(w => w.trim().length > 0).length : 0,
        charsCount: content ? content.length : 0
      };
      
      parsedMessages.push(lastMessage);
    } else {
      // It is a continuation of the previous message (multi-line)
      if (lastMessage) {
        lastMessage.content += '\n' + rawLine;
        lastMessage.wordsCount = lastMessage.content.split(/\s+/).filter(w => w.trim().length > 0).length;
        lastMessage.charsCount = lastMessage.content.length;
        // Re-evaluate flags on extended content
        lastMessage.isMedia = checkMedia(lastMessage.content);
        lastMessage.isDeleted = checkDeleted(lastMessage.content);
        lastMessage.linksCount = countLinks(lastMessage.content);
      }
    }
  }

  // Determine chat participants (personal chat should have exactly 2 main ones)
  const participants = Array.from(participantsSet);

  return {
    messages: parsedMessages,
    participants: participants.sort((a, b) => b.length - a.length) // sort to identify longest names first
  };
}

/**
 * Parses date and time components into a standard JavaScript Date object.
 */
function parseDateTime(dateStr, timeStr, dateFormat) {
  try {
    // 1. Parse date
    const dateParts = dateStr.split(/[/\-.]/).map(p => parseInt(p, 10));
    if (dateParts.length !== 3) return null;

    let day, month, year;
    
    if (dateFormat === 'MM/DD/YY') {
      month = dateParts[0] - 1; // 0-indexed
      day = dateParts[1];
      year = dateParts[2];
    } else { // 'DD/MM/YY' or standard
      day = dateParts[0];
      month = dateParts[1] - 1; // 0-indexed
      year = dateParts[2];
    }

    // Adjust 2-digit years
    if (year < 100) {
      year += 2000;
    }

    // 2. Parse time
    const timeClean = timeStr.toLowerCase();
    const isPm = timeClean.includes('pm') || timeClean.includes('p.m.');
    const isAm = timeClean.includes('am') || timeClean.includes('a.m.');
    
    const numericalTime = timeClean.replace(/[ap]\.?[m]\.?/g, '').trim();
    const timeParts = numericalTime.split(':').map(p => parseInt(p, 10));
    
    let hours = timeParts[0];
    const minutes = timeParts[1];
    const seconds = timeParts[2] || 0;

    if (isPm && hours < 12) hours += 12;
    if (isAm && hours === 12) hours = 0;

    const date = new Date(year, month, day, hours, minutes, seconds);
    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    return null;
  }
}

/**
 * Helper to identify if content is a WhatsApp media placeholder
 */
function checkMedia(content) {
  if (!content) return false;
  const lower = content.toLowerCase();
  return (
    lower.includes('<media omitted>') ||
    lower.includes('image omitted') ||
    lower.includes('video omitted') ||
    lower.includes('sticker omitted') ||
    lower.includes('audio omitted') ||
    lower.includes('document omitted') ||
    lower.includes('contact card omitted') ||
    content.includes('‎image omitted') || 
    content.includes('‎video omitted') ||
    content.includes('‎sticker omitted')
  );
}

/**
 * Helper to identify if content matches deletion markers
 */
function checkDeleted(content) {
  if (!content) return false;
  const lower = content.toLowerCase();
  return (
    lower.includes('this message was deleted') ||
    lower.includes('you deleted this message') ||
    lower.includes('message was deleted')
  );
}

/**
 * Helper to count URLs in a message
 */
function countLinks(content) {
  if (!content) return 0;
  const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
  const matches = content.match(urlRegex);
  return matches ? matches.length : 0;
}
