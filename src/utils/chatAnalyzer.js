/**
 * Analyzes parsed WhatsApp chat messages and computes high-end stats,
 * monthly capsules, milestones, awards, personalities, and compatibility.
 */

// Basic stop words in English and Hinglish (common WhatsApp chat filler words)
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'to', 'of', 'and', 'but', 'or', 'nor', 'yet', 'so', 'for', 'in', 'on', 'at',
  'by', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'from', 'up', 'down', 'in', 'out',
  'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should',
  'now', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
  'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them',
  'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this',
  'that', 'these', 'those',
  // Hinglish
  'h', 'hai', 'ha', 'ko', 'ki', 'ka', 'ke', 'aur', 'bhi', 'toh', 'se', 'ye',
  'jo', 'kya', 'na', 'ne', 'me', 'mai', 'pr', 'par', 'tha', 'thi', 'the',
  'kr', 'kar', 'karna', 'kya', 'he', 'ho', 'yaar', 'yr', 'ab', 'gaya', 'gayi',
  'gaye', 'hu', 'hua', 'hue', 'chal', 'achha', 'acha', 'han', 'haan', 'ya', 're'
]);

// Helper to extract emojis from a string
function extractEmojis(str) {
  if (!str) return [];
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]/gu;
  return str.match(emojiRegex) || [];
}

export function analyzeChat(messages, participants) {
  if (!messages || messages.length === 0) return null;

  // We expect a personal chat between 2 participants.
  // If there are more/fewer, extract the top 2 senders by message count as active, or fill in
  const senderCounts = {};
  messages.forEach(m => {
    senderCounts[m.sender] = (senderCounts[m.sender] || 0) + 1;
  });
  const sortedSenders = Object.keys(senderCounts).sort((a, b) => senderCounts[b] - senderCounts[a]);
  
  const user1 = sortedSenders[0] || 'Chamber 1';
  const user2 = sortedSenders[1] || (participants.find(p => p !== user1) || 'Chamber 2');
  const chatters = [user1, user2];

  // Initialize stats per user
  const userStats = {};
  chatters.forEach(u => {
    userStats[u] = {
      name: u,
      messagesCount: 0,
      wordsCount: 0,
      charsCount: 0,
      mediaCount: 0,
      viewOnceCount: 0,
      deletedCount: 0,
      linksCount: 0,
      doubleTextCount: 0,
      chaosCascadesCount: 0,
      midnightBroadcastsCount: 0,
      emojis: [],
      emojiCount: 0,
      wordsUsed: {},
      longestMsgLength: 0,
      longestMsgContent: '',
      longestMsgWords: 0,
      totalResponseTime: 0,
      responseTimesCount: 0
    };
  });

  // Streaks and Time Analysis
  const datesSet = new Set();
  const dayMessageCounts = {}; // 'YYYY-MM-DD' -> count
  const hourlyDistribution = Array(24).fill(0);
  const userHourlyDistribution = {
    [user1]: Array(24).fill(0),
    [user2]: Array(24).fill(0)
  };
  const weekdayDistribution = Array(7).fill(0); // 0 = Sunday
  const monthlyDistribution = {}; // 'YYYY-MM' -> count
  
  // For inside joke extraction & vocabulary tracking
  const allEmojis = [];
  const wordsOverall = {};

  // For reply speed tracking
  let lastMessage = null;

  // For Double Text and Chaos tracking
  // Chaos cascade: 3+ messages sent within 1 minute
  let cascadeUser = null;
  let cascadeStart = null;
  let cascadeCount = 0;

  messages.forEach((msg, idx) => {
    const sender = msg.sender;
    // Fallback if message belongs to minor participant
    const activeUser = userStats[sender] ? sender : user1;
    const stats = userStats[activeUser];

    // Basic additions
    stats.messagesCount++;
    stats.wordsCount += msg.wordsCount;
    stats.charsCount += msg.charsCount;
    if (msg.isMedia) stats.mediaCount++;
    if (msg.isViewOnce) stats.viewOnceCount++;
    if (msg.isDeleted) stats.deletedCount++;
    stats.linksCount += msg.linksCount;

    // Date/Time extractions
    const d = msg.date;
    const dateStr = d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    datesSet.add(dateStr);
    dayMessageCounts[dateStr] = (dayMessageCounts[dateStr] || 0) + 1;

    const hour = d.getHours();
    hourlyDistribution[hour]++;
    userHourlyDistribution[activeUser][hour]++;
    weekdayDistribution[d.getDay()]++;

    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // 'YYYY-MM'
    monthlyDistribution[monthStr] = (monthlyDistribution[monthStr] || 0) + 1;

    // Midnight broadcast (12 AM to 4 AM)
    if (hour >= 0 && hour < 4) {
      stats.midnightBroadcastsCount++;
    }

    // Longest message
    if (msg.wordsCount > stats.longestMsgWords && !msg.isMedia && !msg.isDeleted) {
      stats.longestMsgWords = msg.wordsCount;
      stats.longestMsgLength = msg.charsCount;
      stats.longestMsgContent = msg.content;
    }

    // Emojis tracking
    const msgEmojis = extractEmojis(msg.content);
    msgEmojis.forEach(em => {
      stats.emojis.push(em);
      allEmojis.push(em);
    });
    stats.emojiCount += msgEmojis.length;

    // Vocabulary tracking
    if (msg.content && !msg.isMedia && !msg.isDeleted) {
      const words = msg.content
        .toLowerCase()
        .replace(/[^\w\s\u0900-\u097F']/g, '') // strip punctuation keeping hindi unicode chars
        .split(/\s+/);
      
      words.forEach(w => {
        if (w.length > 2 && !STOP_WORDS.has(w)) {
          stats.wordsUsed[w] = (stats.wordsUsed[w] || 0) + 1;
          wordsOverall[w] = (wordsOverall[w] || 0) + 1;
        }
      });
    }

    // Double Text Tracking (>5 min silence or successive blocks without user change, we count consecutive sends)
    if (lastMessage) {
      const timeDiffSec = (d.getTime() - lastMessage.date.getTime()) / 1000;
      
      if (lastMessage.sender === msg.sender) {
        // Double text if gap is > 300 seconds (5 mins)
        if (timeDiffSec > 300) {
          stats.doubleTextCount++;
        }
        
        // Chaos cascade check (successive messages within 60s)
        if (cascadeUser === msg.sender && cascadeStart) {
          const cascadeDiff = (d.getTime() - cascadeStart.getTime()) / 1000;
          if (cascadeDiff <= 60) {
            cascadeCount++;
          } else {
            if (cascadeCount >= 3) {
              userStats[cascadeUser].chaosCascadesCount++;
            }
            cascadeStart = d;
            cascadeCount = 1;
          }
        } else {
          cascadeUser = msg.sender;
          cascadeStart = d;
          cascadeCount = 1;
        }
      } else {
        // Turn changed! Evaluate final cascade
        if (cascadeUser && cascadeCount >= 3) {
          userStats[cascadeUser].chaosCascadesCount++;
        }
        cascadeUser = null;
        cascadeStart = null;
        cascadeCount = 0;

        // Reply Speed Sync: calculate response time if gap is less than 3 hours (excluding overnight silence)
        if (timeDiffSec < 10800) {
          stats.totalResponseTime += timeDiffSec;
          stats.responseTimesCount++;
        }
      }
    } else {
      cascadeUser = msg.sender;
      cascadeStart = d;
      cascadeCount = 1;
    }

    lastMessage = msg;
  });

  // Resolve final active cascade
  if (cascadeUser && cascadeCount >= 3) {
    userStats[cascadeUser].chaosCascadesCount++;
  }

  // Finalize Streaks
  const uniqueDatesSorted = Array.from(datesSet).sort();
  let maxStreak = 0;
  let currentStreak = 0;
  let runningStreak = 0;
  let lastStreakDate = null;

  uniqueDatesSorted.forEach((dStr, idx) => {
    const currentDate = new Date(dStr);
    
    if (lastStreakDate) {
      const diffTime = Math.abs(currentDate - lastStreakDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        if (runningStreak > maxStreak) maxStreak = runningStreak;
        runningStreak = 1; // reset to 1
      }
    } else {
      runningStreak = 1;
    }
    lastStreakDate = currentDate;
  });
  if (runningStreak > maxStreak) maxStreak = runningStreak;

  // Calculate current streak
  if (uniqueDatesSorted.length > 0) {
    const lastActiveStr = uniqueDatesSorted[uniqueDatesSorted.length - 1];
    const lastActiveDate = new Date(lastActiveStr);
    // Setting today matching the context local time (2026-05-31)
    const today = new Date('2026-05-31');
    const diffTime = Math.abs(today - lastActiveDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      currentStreak = runningStreak;
    } else {
      currentStreak = 0; // Streak broken
    }
  }

  // Compile individual top emojis and top words
  chatters.forEach(u => {
    const stats = userStats[u];
    
    // Sort emojis
    const emojiFreq = {};
    stats.emojis.forEach(em => {
      emojiFreq[em] = (emojiFreq[em] || 0) + 1;
    });
    stats.topEmojis = Object.entries(emojiFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    stats.favoriteEmoji = stats.topEmojis[0] ? stats.topEmojis[0][0] : '💬';

    // Sort words
    stats.topWords = Object.entries(stats.wordsUsed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
  });

  // Global Emojis
  const globalEmojiFreq = {};
  allEmojis.forEach(em => {
    globalEmojiFreq[em] = (globalEmojiFreq[em] || 0) + 1;
  });
  const topGlobalEmojis = Object.entries(globalEmojiFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Global words
  const topGlobalWords = Object.entries(wordsOverall)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  // General metrics
  const totalDays = uniqueDatesSorted.length || 1;
  const totalMessages = messages.length;
  const totalWords = messages.reduce((sum, m) => sum + m.wordsCount, 0);

  // Busiest Day Ever
  let busiestDayStr = 'N/A';
  let busiestDayCount = 0;
  Object.entries(dayMessageCounts).forEach(([dStr, cnt]) => {
    if (cnt > busiestDayCount) {
      busiestDayCount = cnt;
      busiestDayStr = dStr;
    }
  });
  
  // Format Busiest Day
  let busiestDayFormatted = 'N/A';
  if (busiestDayStr !== 'N/A') {
    const bdDate = new Date(busiestDayStr);
    busiestDayFormatted = bdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Monthly capsules compilation
  const monthlyCapsules = compileMonthlyCapsules(messages, chatters, userStats);

  // Alternate Universe Awards winners mapping
  const awards = compileAwards(chatters, userStats);

  // User personalities mapping
  const personalities = compilePersonalities(chatters, userStats);

  // Compatibility Index
  const compatibility = compileCompatibility(chatters, userStats, userHourlyDistribution);

  // Milestones compilation
  const milestones = compileMilestones(messages, chatters, maxStreak, busiestDayStr, busiestDayCount);

  return {
    chatters,
    totalMessages,
    totalWords,
    totalDays,
    maxStreak,
    currentStreak,
    busiestDay: {
      date: busiestDayFormatted,
      count: busiestDayCount
    },
    avgMessagesPerDay: +(totalMessages / totalDays).toFixed(1),
    userStats,
    hourlyDistribution,
    userHourlyDistribution,
    weekdayDistribution,
    monthlyDistribution,
    topGlobalEmojis,
    topGlobalWords,
    monthlyCapsules,
    awards,
    personalities,
    compatibility,
    milestones
  };
}

/**
 * Compiles Alternate Universe Awards based on stats metrics.
 */
function compileAwards(chatters, userStats) {
  const [u1, u2] = chatters;
  const s1 = userStats[u1];
  const s2 = userStats[u2];

  // CEO of Double Texting
  const doubleTextWinner = s1.doubleTextCount >= s2.doubleTextCount ? u1 : u2;

  // Minister of Chaos (burst texting cascades)
  const chaosWinner = s1.chaosCascadesCount >= s2.chaosCascadesCount ? u1 : u2;

  // Emoji Economist (highest emoji count per message)
  const rate1 = s1.emojiCount / (s1.messagesCount || 1);
  const rate2 = s2.emojiCount / (s2.messagesCount || 1);
  const emojiWinner = rate1 >= rate2 ? u1 : u2;

  // Meme Lord / Meme Queen (most media sent)
  const mediaWinner = s1.mediaCount >= s2.mediaCount ? u1 : u2;

  // Certified Yapper (highest average words per message)
  const yap1 = s1.wordsCount / (s1.messagesCount || 1);
  const yap2 = s2.wordsCount / (s2.messagesCount || 1);
  const yapperWinner = yap1 >= yap2 ? u1 : u2;

  // Human Search Bar (most links shared)
  const linksWinner = s1.linksCount >= s2.linksCount ? u1 : u2;

  return [
    {
      id: 'double-text',
      title: 'CEO of Double Texting',
      winner: doubleTextWinner,
      score: userStats[doubleTextWinner].doubleTextCount,
      metricName: 'Repeat performances',
      emoji: '📱',
      description: 'Always one message ahead of the reply. The typing indicator is their second home.',
      colorClass: 'sunset'
    },
    {
      id: 'chaos',
      title: 'Minister of Chaos',
      winner: chaosWinner,
      score: userStats[chaosWinner].chaosCascadesCount,
      metricName: 'Longest cascade streaks',
      emoji: '🌪️',
      description: 'Turns one simple thought into an overlapping cascade of 3+ quick-fire messages.',
      colorClass: 'purple'
    },
    {
      id: 'emoji',
      title: 'Emoji Economist',
      winner: emojiWinner,
      score: +(emojiWinner === u1 ? rate1 : rate2).toFixed(3),
      metricName: 'Emoji rate per message',
      emoji: '🎨',
      description: 'Can narrate their entire life story with three perfectly chosen symbols.',
      colorClass: 'gold'
    },
    {
      id: 'meme-lord',
      title: 'Meme Lord / Meme Queen',
      winner: mediaWinner,
      score: userStats[mediaWinner].mediaCount,
      metricName: 'Media files shared',
      emoji: '🖼️',
      description: 'Always armed with the perfect reaction image, sticker, or photo dump. Speaks fluent visual humor.',
      colorClass: 'royal'
    },
    {
      id: 'yapper',
      title: 'Certified Yapper',
      winner: yapperWinner,
      score: +(yapperWinner === u1 ? yap1 : yap2).toFixed(1),
      metricName: 'Avg words per message',
      emoji: '🗣️',
      description: 'Why use three words when you can write a beautiful multi-paragraph essay of raw lore?',
      colorClass: 'emerald'
    },
    {
      id: 'search-bar',
      title: 'Human Search Bar',
      winner: linksWinner,
      score: userStats[linksWinner].linksCount,
      metricName: 'Links shared',
      emoji: '🔗',
      description: 'Already has the exact hyperlink ready to share before you even ask.',
      colorClass: 'cyan'
    }
  ];
}

/**
 * Assigns fun chat personality profiles to each user.
 */
function compilePersonalities(chatters, userStats) {
  return chatters.map(u => {
    const stats = userStats[u];
    const totalMsg = stats.messagesCount || 1;
    
    const emojiRate = stats.emojiCount / totalMsg;
    const avgLen = stats.charsCount / totalMsg;
    const midnightRate = stats.midnightBroadcastsCount / totalMsg;
    const doubleTextRate = stats.doubleTextCount / totalMsg;

    let role = 'The Conversationalist';
    let subtitle = 'The chat balancer';
    let desc = 'Keeps the dialog in absolute harmony. The glue that holds the daily updates together.';
    let icon = '💬';
    let colorClass = 'cyan';

    if (midnightRate > 0.25) {
      role = 'The Night Owl';
      subtitle = 'Late night drops';
      desc = 'The chat never sleeps. They drop the heaviest gossip and deepest lore in the quiet hours of the night.';
      icon = '🌙';
      colorClass = 'purple';
    } else if (emojiRate > 1.2) {
      role = 'The Reactor';
      subtitle = 'Reacts to literally everything';
      desc = 'A burst of visual emotions. Words are secondary; their responses are custom tapestries of animated symbols.';
      icon = '😂';
      colorClass = 'gold';
    } else if (avgLen > 35) {
      role = 'The Novelist';
      subtitle = 'Paragraph builder';
      desc = 'Feared by short replies. They compose essays, packing intense depth and detailed context into massive scroll blocks.';
      icon = '✍️';
      colorClass = 'emerald';
    } else if (doubleTextRate > 0.20) {
      role = 'The Speed Typer';
      subtitle = 'Double-text king';
      desc = 'Can send three messages before you even compose a word. Their thoughts are lightning-fast.';
      icon = '⚡';
      colorClass = 'sunset';
    }

    return {
      user: u,
      role,
      subtitle,
      desc,
      icon,
      colorClass,
      favoriteEmoji: stats.favoriteEmoji
    };
  });
}

/**
 * Calculates compatibility report parameters.
 */
function compileCompatibility(chatters, userStats, hourlyDist) {
  const [u1, u2] = chatters;
  const s1 = userStats[u1];
  const s2 = userStats[u2];

  // 1. Reply Speed Sync
  const avgSpeed1 = s1.responseTimesCount > 0 ? (s1.totalResponseTime / s1.responseTimesCount) : 120;
  const avgSpeed2 = s2.responseTimesCount > 0 ? (s2.totalResponseTime / s2.responseTimesCount) : 120;
  const maxSpeed = Math.max(avgSpeed1, avgSpeed2, 1);
  const minSpeed = Math.min(avgSpeed1, avgSpeed2);
  const speedRatio = minSpeed / maxSpeed;
  const replySync = Math.round(50 + speedRatio * 50); // Scale 50-100%

  // 2. Emoji Style Match (overlap percentage)
  const e1Set = new Set(s1.emojis);
  const e2Set = new Set(s2.emojis);
  let emojiIntersection = 0;
  let emojiUnion = Math.max(e1Set.size + e2Set.size, 1);
  e1Set.forEach(e => {
    if (e2Set.has(e)) emojiIntersection++;
  });
  const emojiStyleMatch = Math.round((emojiIntersection / emojiUnion) * 100) || 68; // fallback to good average if small emojis

  // 3. Active Hours Overlap (correlation of distributions)
  const dist1 = hourlyDist[u1];
  const dist2 = hourlyDist[u2];
  let overlapDot = 0;
  let norm1 = 0;
  let norm2 = 0;
  for (let i = 0; i < 24; i++) {
    overlapDot += dist1[i] * dist2[i];
    norm1 += dist1[i] * dist1[i];
    norm2 += dist2[i] * dist2[i];
  }
  const denominator = Math.sqrt(norm1 * norm2) || 1;
  const overlapPercent = Math.round((overlapDot / denominator) * 100) || 85;

  // 4. Conversation Balance (50/50 is perfect)
  const totalMsg = s1.messagesCount + s2.messagesCount || 1;
  const share1 = (s1.messagesCount / totalMsg) * 100;
  const balance = Math.round(100 - Math.abs(share1 - 50) * 2);

  // Overall Score
  const score = Math.round((replySync + emojiStyleMatch + overlapPercent + balance) / 4);

  let tag = 'Soulmates — you finish each other\'s sentences!';
  let icon = '❤️';
  if (score >= 90) {
    tag = 'Soulmates — you finish each other\'s sentences!';
    icon = '💝 🔄';
  } else if (score >= 80) {
    tag = 'Late Night Gossipers — the lore runs deep!';
    icon = '🌙 🗣️';
  } else if (score >= 70) {
    tag = 'Speed Dial Buddies — always there in a flash!';
    icon = '⚡ 🤝';
  } else {
    tag = 'Balanced Banterers — standard daily comfort rhythm.';
    icon = '⚖️ 💬';
  }

  return {
    score,
    tag,
    icon,
    replySync,
    emojiStyleMatch,
    overlapPercent,
    balance
  };
}

/**
 * Compiles month-by-month time capsules.
 */
function compileMonthlyCapsules(messages, chatters, userStats) {
  const [u1, u2] = chatters;
  const monthsData = {};

  messages.forEach(msg => {
    const d = msg.date;
    const monthName = d.toLocaleDateString('en-US', { month: 'short' }); // "Apr", "May"
    const key = monthName;

    if (!monthsData[key]) {
      monthsData[key] = {
        name: monthName,
        messagesCount: 0,
        busiestDayStr: '',
        busiestDayCount: 0,
        dayCounts: {},
        senders: { [u1]: 0, [u2]: 0 },
        emojis: [],
        mediaCount: 0,
        viewOnceCount: 0,
        linksCount: 0,
        deletedCount: 0,
        firstMsgOfDay: true,
        lastMsgTime: null
      };
    }

    const mStats = monthsData[key];
    mStats.messagesCount++;
    mStats.senders[msg.sender] = (mStats.senders[msg.sender] || 0) + 1;
    if (msg.isMedia) mStats.mediaCount++;
    if (msg.isViewOnce) mStats.viewOnceCount++;
    if (msg.isDeleted) mStats.deletedCount++;
    mStats.linksCount += msg.linksCount;

    // Day counting inside month
    const dateStr = d.toISOString().split('T')[0];
    mStats.dayCounts[dateStr] = (mStats.dayCounts[dateStr] || 0) + 1;

    // Track emojis
    const msgEmojis = extractEmojis(msg.content);
    msgEmojis.forEach(em => mStats.emojis.push(em));

    mStats.lastMsgTime = d;
  });

  // Format capsules for returning
  const capsules = Object.entries(monthsData).map(([key, data]) => {
    // Determine main character of month
    const mainCharacter = data.senders[u1] >= data.senders[u2] ? u1 : u2;
    const mcMessages = data.senders[mainCharacter];

    // Busiest day of month
    let busiestDayStr = 'N/A';
    let busiestDayCount = 0;
    Object.entries(data.dayCounts).forEach(([dStr, cnt]) => {
      if (cnt > busiestDayCount) {
        busiestDayCount = cnt;
        busiestDayStr = dStr;
      }
    });

    const activeDaysCount = Object.keys(data.dayCounts).length;

    let busiestDayFormatted = 'N/A';
    if (busiestDayStr !== 'N/A') {
      const bd = new Date(busiestDayStr);
      busiestDayFormatted = bd.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }

    // Mascot Emoji (most frequent emoji in this month)
    const emojiFreq = {};
    data.emojis.forEach(em => {
      emojiFreq[em] = (emojiFreq[em] || 0) + 1;
    });
    const sortedEmojis = Object.entries(emojiFreq).sort((a, b) => b[1] - a[1]);
    const mascotEmoji = sortedEmojis[0] ? sortedEmojis[0][0] : '😂';

    // Mood sentence builder
    let mood = 'midnight lore';
    const totalMonth = data.messagesCount || 1;
    const u1Stats = userStats[u1];
    
    if (data.emojis.length > totalMonth * 1.5) {
      mood = 'chaotic emoji banter';
    } else if (sortedEmojis[0] && sortedEmojis[0][0] === '❤️') {
      mood = 'deep emotional sync';
    } else if (totalMonth > 5000) {
      mood = 'hyperactive talking era';
    }

    const description = `🌙 The mood was ${mood}, ${mainCharacter} led the era, and ${mascotEmoji} became the unofficial mascot.`;

    return {
      key,
      monthName: key,
      year: '2026',
      totalMessages: data.messagesCount,
      mainCharacter,
      mcMessages,
      busiestDay: busiestDayFormatted,
      activeDaysCount,
      insideJoke: 'message edited', // default cute joke
      signatureEmoji: mascotEmoji,
      description,
      mediaCount: data.mediaCount,
      viewOnceCount: data.viewOnceCount,
      linksCount: data.linksCount,
      deletedCount: data.deletedCount
    };
  });

  return capsules;
}

/**
 * Builds standard timeline milestones.
 */
function compileMilestones(messages, chatters, maxStreak, busiestDayStr, busiestDayCount) {
  const [u1, u2] = chatters;
  const milestones = [];

  // 1. First Message
  const firstMsg = messages[0];
  if (firstMsg) {
    let descContent = '';
    if (firstMsg.isMedia) {
      descContent = "📷 Shared a media memory snippet to start the conversation!";
    } else {
      descContent = firstMsg.content ? `"${firstMsg.content.slice(0, 100)}${firstMsg.content.length > 100 ? '...' : ''}"` : "Conversations officially kicked off!";
    }

    milestones.push({
      id: 'first-msg',
      title: 'First Message',
      subtitle: firstMsg.sender,
      date: formatDate(firstMsg.date),
      desc: descContent,
      type: 'chat',
      icon: '💬',
      colorClass: 'emerald'
    });
  }

  // 2. First photo shared
  const mediaMsg = messages.find(m => m.isMedia);
  if (mediaMsg) {
    milestones.push({
      id: 'first-photo',
      title: 'First Photo Shared',
      subtitle: mediaMsg.sender,
      date: formatDate(mediaMsg.date),
      desc: 'Shared a media memory snippet, kicking off photo dumps!',
      type: 'photo',
      icon: '📸',
      colorClass: 'cyan'
    });
  }

  // 3. First "I Love You" (Cute trigger)
  const loveMsg = messages.find(m => {
    const content = m.content ? m.content.toLowerCase() : '';
    return content.includes('i love you') || content.includes('love you baby') || /\bily\b/.test(content);
  });
  if (loveMsg) {
    milestones.push({
      id: 'first-love',
      title: 'First "I Love You"',
      subtitle: loveMsg.sender,
      date: formatDate(loveMsg.date),
      desc: `"${loveMsg.content.slice(0, 120)}"`,
      type: 'love',
      icon: '❤️',
      colorClass: 'pink'
    });
  }

  // 4. Streak milestones (dates it at the end of the chat history so it shows at the end)
  if (maxStreak > 0) {
    const lastMsg = messages[messages.length - 1];
    milestones.push({
      id: 'streak',
      title: 'Longest Streak',
      subtitle: `${maxStreak} consecutive days`,
      date: lastMsg ? formatDate(lastMsg.date) : 'End',
      desc: 'Conversations flowing non-stop like clockwork.',
      type: 'streak',
      icon: '📅',
      colorClass: 'purple'
    });
  }

  // 5. Message Volume milestones (1k, 5k, 10k, 25k)
  const volumeMilestones = [1000, 5000, 10000, 25000, 50000, 100000];
  volumeMilestones.forEach(vol => {
    if (messages.length >= vol) {
      const volMsg = messages[vol - 1];
      milestones.push({
        id: `milestone-${vol}`,
        title: 'Message Milestone',
        subtitle: `${vol.toLocaleString()} messages`,
        date: formatDate(volMsg.date),
        desc: 'Chat volumes reaching planetary orbits.',
        type: 'volume',
        icon: '🏆',
        colorClass: 'gold'
      });
    }
  });

  // 6. Busiest Day Ever
  if (busiestDayStr !== 'N/A') {
    milestones.push({
      id: 'busiest-day',
      title: 'Busiest Day Ever',
      subtitle: `${busiestDayCount.toLocaleString()} messages`,
      date: formatDate(new Date(busiestDayStr)),
      desc: 'Notifications blazing all day and night long.',
      type: 'busiest',
      icon: '🔥',
      colorClass: 'sunset'
    });
  }

  // Sort milestones chronologically
  return milestones.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
