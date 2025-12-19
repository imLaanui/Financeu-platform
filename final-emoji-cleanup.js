const fs = require('fs');
const path = require('path');

// Comprehensive emoji to icon/text mapping
const emojiReplacements = {
    // Checkmarks and status indicators
    '✓': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 8 L6 12 L14 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    '✅': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" fill="#10B981"/><path d="M4 8 L7 11 L12 5" stroke="white" stroke-width="2" fill="none"/></svg>',
    '❌': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" fill="#EF4444"/><path d="M5 5 L11 11 M11 5 L5 11" stroke="white" stroke-width="2"/></svg>',
    '✗': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" stroke-width="2"/></svg>',
    '⚠': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2 L14 14 L2 14 Z" fill="#F59E0B"/><path d="M8 6 L8 10 M8 11.5 L8 12.5" stroke="white" stroke-width="1.5"/></svg>',
    '⚠️': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2 L14 14 L2 14 Z" fill="#F59E0B"/><path d="M8 6 L8 10 M8 11.5 L8 12.5" stroke="white" stroke-width="1.5"/></svg>',

    // Money and finance
    '💰': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="#10B981"/><text x="10" y="14" text-anchor="middle" font-size="10" fill="white" font-weight="bold">$</text></svg>',
    '💳': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="16" height="10" rx="2" fill="#3B82F6"/><rect x="2" y="7" width="16" height="2" fill="#1D4ED8"/></svg>',
    '💸': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" stroke="#10B981" stroke-width="2" fill="none"/><text x="10" y="14" text-anchor="middle" font-size="10" fill="#10B981" font-weight="bold">$</text></svg>',
    '💼': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="14" height="9" rx="1" stroke="#6B7280" stroke-width="1.5" fill="none"/><rect x="7" y="5" width="6" height="3" stroke="#6B7280" stroke-width="1.5" fill="none"/></svg>',

    // Learning and knowledge
    '💡': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="8" r="4" fill="#FCD34D"/><rect x="8" y="12" width="4" height="3" fill="#FCD34D"/><rect x="7" y="15" width="6" height="1" fill="#FCD34D"/></svg>',
    '📚': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="4" height="12" fill="#3B82F6"/><rect x="8" y="5" width="4" height="12" fill="#10B981"/><rect x="13" y="5" width="4" height="12" fill="#F59E0B"/></svg>',
    '📓': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="10" height="14" rx="1" fill="#3B82F6"/><line x1="8" y1="6" x2="14" y2="6" stroke="white" stroke-width="1"/><line x1="8" y1="9" x2="14" y2="9" stroke="white" stroke-width="1"/></svg>',
    '🎓': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="10,5 2,9 10,13 18,9" fill="#3B82F6"/><polygon points="10,13 6,11 6,14 10,16 14,14 14,11" fill="#60A5FA"/></svg>',
    '📝': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="2" width="12" height="16" rx="1" stroke="#3B82F6" stroke-width="1.5" fill="none"/><line x1="7" y1="6" x2="13" y2="6" stroke="#3B82F6" stroke-width="1"/><line x1="7" y1="9" x2="13" y2="9" stroke="#3B82F6" stroke-width="1"/><line x1="7" y1="12" x2="10" y2="12" stroke="#3B82F6" stroke-width="1"/></svg>',

    // Charts and data
    '📊': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="10" width="3" height="7" fill="#3B82F6"/><rect x="8" y="7" width="3" height="10" fill="#10B981"/><rect x="13" y="4" width="3" height="13" fill="#F59E0B"/></svg>',
    '📈': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="2,15 7,10 12,12 18,4" stroke="#10B981" stroke-width="2" fill="none"/><polyline points="14,4 18,4 18,8" stroke="#10B981" stroke-width="2" fill="none"/></svg>',

    // Goals and targets
    '🎯': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" stroke="#EF4444" stroke-width="1.5" fill="none"/><circle cx="10" cy="10" r="5" stroke="#EF4444" stroke-width="1.5" fill="none"/><circle cx="10" cy="10" r="2" fill="#EF4444"/></svg>',
    '🏆': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4 L6 8 C6 10 8 12 10 12 C12 12 14 10 14 8 L14 4 Z" fill="#FCD34D"/><rect x="8" y="12" width="4" height="4" fill="#FCD34D"/><rect x="6" y="16" width="8" height="1" fill="#FCD34D"/><path d="M5 4 L3 4 C3 6 4 7 5 7" stroke="#FCD34D" stroke-width="1" fill="none"/><path d="M15 4 L17 4 C17 6 16 7 15 7" stroke="#FCD34D" stroke-width="1" fill="none"/></svg>',
    '⚡': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="11,2 5,11 9,11 7,18 15,9 11,9" fill="#FCD34D"/></svg>',
    '🌟': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="#FCD34D"/></svg>',
    '💪': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8 C6 6 7 5 8 5 C9 5 10 6 10 8 L10 15 C10 16 9 17 8 17 C7 17 6 16 6 15 Z" fill="#F59E0B"/><circle cx="8" cy="5" r="2" fill="#F59E0B"/></svg>',

    // Security and protection
    '🛡': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2 L4 5 L4 10 C4 14 10 18 10 18 C10 18 16 14 16 10 L16 5 Z" fill="#10B981"/></svg>',
    '🛡️': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2 L4 5 L4 10 C4 14 10 18 10 18 C10 18 16 14 16 10 L16 5 Z" fill="#10B981"/></svg>',
    '🔒': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="9" width="10" height="8" rx="1" fill="#6B7280"/><path d="M7 9 L7 6 C7 4.3 8.3 3 10 3 C11.7 3 13 4.3 13 6 L13 9" stroke="#6B7280" stroke-width="2" fill="none"/></svg>',

    // Communication and people
    '👥': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="3" fill="#3B82F6"/><circle cx="13" cy="7" r="3" fill="#60A5FA"/><path d="M2 17 C2 14 4 12 7 12 C10 12 12 14 12 17" fill="#3B82F6"/><path d="M8 17 C8 14 10 12 13 12 C16 12 18 14 18 17" fill="#60A5FA"/></svg>',
    '👀': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="6" cy="10" rx="4" ry="3" fill="#3B82F6"/><ellipse cx="14" cy="10" rx="4" ry="3" fill="#3B82F6"/><circle cx="6" cy="10" r="1.5" fill="white"/><circle cx="14" cy="10" r="1.5" fill="white"/></svg>',

    // Calendar and time
    '📅': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="14" height="13" rx="1" stroke="#EF4444" stroke-width="1.5" fill="none"/><rect x="3" y="7" width="14" height="1" fill="#EF4444"/><line x1="7" y1="2" x2="7" y2="6" stroke="#EF4444" stroke-width="1.5"/><line x1="13" y1="2" x2="13" y2="6" stroke="#EF4444" stroke-width="1.5"/></svg>',
    '📆': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="14" height="13" rx="1" stroke="#3B82F6" stroke-width="1.5" fill="none"/><rect x="3" y="7" width="14" height="1" fill="#3B82F6"/><line x1="7" y1="2" x2="7" y2="6" stroke="#3B82F6" stroke-width="1.5"/><line x1="13" y1="2" x2="13" y2="6" stroke="#3B82F6" stroke-width="1.5"/></svg>',
    '🗓': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="14" height="13" rx="1" stroke="#10B981" stroke-width="1.5" fill="none"/><rect x="3" y="7" width="14" height="1" fill="#10B981"/><line x1="7" y1="2" x2="7" y2="6" stroke="#10B981" stroke-width="1.5"/><line x1="13" y1="2" x2="13" y2="6" stroke="#10B981" stroke-width="1.5"/></svg>',

    // Celebration and success
    '🎉': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="1" fill="#F59E0B"/><circle cx="16" cy="4" r="1" fill="#EF4444"/><circle cx="4" cy="16" r="1" fill="#3B82F6"/><circle cx="16" cy="16" r="1" fill="#10B981"/><path d="M10 6 L12 14 L8 14 Z" fill="#F59E0B"/><rect x="8" y="14" width="4" height="2" fill="#EF4444"/></svg>',

    // Houses and buildings
    '🏠': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10 L10 3 L17 10 L17 17 L3 17 Z" fill="#3B82F6"/><rect x="8" y="12" width="4" height="5" fill="#60A5FA"/></svg>',
    '🏡': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10 L10 3 L17 10 L17 17 L3 17 Z" fill="#10B981"/><rect x="8" y="12" width="4" height="5" fill="#34D399"/></svg>',
    '🏛': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 8 L10 3 L18 8" stroke="#6B7280" stroke-width="1.5" fill="none"/><rect x="4" y="8" width="2" height="7" fill="#6B7280"/><rect x="9" y="8" width="2" height="7" fill="#6B7280"/><rect x="14" y="8" width="2" height="7" fill="#6B7280"/><rect x="2" y="15" width="16" height="2" fill="#6B7280"/></svg>',
    '🏪': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="7" width="12" height="10" fill="#3B82F6"/><path d="M2 7 L10 3 L18 7" fill="#EF4444"/><rect x="8" y="11" width="4" height="6" fill="#60A5FA"/></svg>',
    '🏙': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="4" height="10" fill="#3B82F6"/><rect x="8" y="4" width="4" height="14" fill="#10B981"/><rect x="14" y="6" width="4" height="12" fill="#F59E0B"/></svg>',

    // Transportation
    '🚗': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="8" width="14" height="6" rx="1" fill="#3B82F6"/><path d="M4 8 L6 5 L14 5 L16 8" fill="#60A5FA"/><circle cx="6" cy="14" r="1.5" fill="#1F2937"/><circle cx="14" cy="14" r="1.5" fill="#1F2937"/></svg>',
    '✈': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 10 L8 8 L8 3 L10 2 L10 8 L18 6 L18 8 L10 11 L10 15 L12 16 L12 17 L10 16 L8 17 L8 16 L10 15 L10 11 L2 12 Z" fill="#3B82F6"/></svg>',

    // Food
    '🍔': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7 L16 7 C16 5 15 4 13 4 L7 4 C5 4 4 5 4 7" fill="#F59E0B"/><rect x="3" y="7" width="14" height="2" fill="#10B981"/><rect x="3" y="9" width="14" height="2" fill="#B45309"/><rect x="3" y="11" width="14" height="2" fill="#F59E0B"/></svg>',
    '🍎': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="11" r="6" fill="#EF4444"/><path d="M10 5 C10 5 9 7 9 7" stroke="#10B981" stroke-width="1.5" fill="none"/></svg>',
    '🍳': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="10" r="5" fill="#FCD34D"/><circle cx="8" cy="10" r="2" fill="#F59E0B"/><rect x="13" y="9" width="5" height="2" rx="1" fill="#6B7280"/></svg>',

    // Shopping
    '🛒': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2 L4 2 L6 12 L16 12" stroke="#3B82F6" stroke-width="1.5" fill="none"/><circle cx="7" cy="15" r="1.5" fill="#3B82F6"/><circle cx="14" cy="15" r="1.5" fill="#3B82F6"/><rect x="6" y="4" width="10" height="8" rx="1" stroke="#3B82F6" stroke-width="1.5" fill="none"/></svg>',
    '🛍': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="12" height="11" rx="1" stroke="#EF4444" stroke-width="1.5" fill="none"/><path d="M7 6 C7 4 8.3 3 10 3 C11.7 3 13 4 13 6" stroke="#EF4444" stroke-width="1.5" fill="none"/></svg>',

    // Communication devices
    '📱': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="2" width="8" height="16" rx="1" stroke="#3B82F6" stroke-width="1.5" fill="none"/><circle cx="10" cy="15" r="1" fill="#3B82F6"/></svg>',
    '📞': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2 L7 2 L8 6 L6 7 C6 7 6 10 10 10 C14 10 14 10 14 10 L15 8 L19 9 L19 12 C19 14 17 16 14 16 C8 16 2 10 2 4 C2 1 3 2 4 2 Z" fill="#10B981"/></svg>',

    // Misc objects
    '📦': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6 L10 2 L17 6 L17 14 L10 18 L3 14 Z" stroke="#B45309" stroke-width="1.5" fill="none"/><polyline points="3,6 10,10 17,6" stroke="#B45309" stroke-width="1.5" fill="none"/><line x1="10" y1="10" x2="10" y2="18" stroke="#B45309" stroke-width="1.5"/></svg>',
    '🔍': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="5" stroke="#6B7280" stroke-width="1.5" fill="none"/><line x1="12" y1="12" x2="17" y2="17" stroke="#6B7280" stroke-width="1.5"/></svg>',
    '💭': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="8" rx="7" ry="5" fill="#DBEAFE"/><circle cx="4" cy="13" r="2" fill="#DBEAFE"/><circle cx="2" cy="16" r="1" fill="#DBEAFE"/></svg>',
    '🎁': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="12" height="9" fill="#EF4444"/><rect x="3" y="6" width="14" height="2" fill="#F59E0B"/><rect x="9" y="6" width="2" height="11" fill="#FCD34D"/><path d="M10 6 C10 4 11 3 12 3 C13 3 13 4 13 5 C13 6 12 6 10 6" fill="#10B981"/><path d="M10 6 C10 4 9 3 8 3 C7 3 7 4 7 5 C7 6 8 6 10 6" fill="#10B981"/></svg>',
    '💻': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="16" height="10" rx="1" stroke="#6B7280" stroke-width="1.5" fill="none"/><rect x="7" y="14" width="6" height="1" fill="#6B7280"/><rect x="5" y="15" width="10" height="1" fill="#6B7280"/></svg>',
    '💾': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="12" height="14" rx="1" fill="#3B82F6"/><rect x="4" y="3" width="12" height="4" fill="#1D4ED8"/><rect x="7" y="5" width="6" height="1" fill="white"/><circle cx="10" cy="11" r="2" fill="white"/></svg>',
    '🎬': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="16" height="11" rx="1" fill="#1F2937"/><rect x="2" y="3" width="16" height="2" fill="#FCD34D"/><rect x="3" y="3" width="2" height="2" fill="#1F2937"/><rect x="7" y="3" width="2" height="2" fill="#1F2937"/><rect x="11" y="3" width="2" height="2" fill="#1F2937"/><rect x="15" y="3" width="2" height="2" fill="#1F2937"/></svg>',
    '📄': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 2 L12 2 L15 5 L15 18 L5 18 Z" stroke="#3B82F6" stroke-width="1.5" fill="white"/><polyline points="12,2 12,5 15,5" stroke="#3B82F6" stroke-width="1.5" fill="none"/></svg>',
    '🔬': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="2" width="6" height="2" fill="#3B82F6"/><rect x="8" y="4" width="4" height="8" fill="#60A5FA"/><path d="M6 12 L8 12 L8 16 L12 16 L12 12 L14 12 L14 17 L6 17 Z" fill="#3B82F6"/></svg>',
    '🔔': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3 C8 3 6 5 6 7 L6 11 L4 13 L16 13 L14 11 L14 7 C14 5 12 3 10 3 Z" fill="#F59E0B"/><path d="M8 13 C8 15 9 16 10 16 C11 16 12 15 12 13" stroke="#F59E0B" stroke-width="1.5" fill="none"/></svg>',

    // Emojis for emotions - replace with text or simple icons
    '😕': '<span style="color: #F59E0B;">⚠</span>',
    '😰': '<span style="color: #EF4444;">(!)</span>',
    '😓': '<span style="color: #F59E0B;">⚠</span>',
    '😔': '<span style="color: #6B7280;">...</span>',
    '😴': '<span style="color: #6B7280;">(-_-)</span>',
    '🤔': '<span style="color: #3B82F6;">(?)</span>',
    '🧐': '<span style="color: #3B82F6;">(?)</span>',
    '😅': '<span style="color: #F59E0B;">(!)</span>',
    '😪': '<span style="color: #6B7280;">(...)</span>',
    '😞': '<span style="color: #6B7280;">(sad)</span>',

    // Status indicators
    '🚨': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" fill="#EF4444"/><path d="M10 6 L10 11 M10 13 L10 14" stroke="white" stroke-width="2"/></svg>',
    '🚫': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="#EF4444" stroke-width="2" fill="none"/><line x1="5" y1="5" x2="15" y2="15" stroke="#EF4444" stroke-width="2"/></svg>',
    '🔴': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="6" fill="#EF4444"/></svg>',
    '🟢': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="6" fill="#10B981"/></svg>',
    '🟡': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="6" fill="#F59E0B"/></svg>',
    '⛔': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" fill="#EF4444"/><circle cx="10" cy="10" r="5" fill="white"/><circle cx="10" cy="10" r="3" fill="#EF4444"/></svg>',

    // Misc
    '🤝': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10 L6 7 L10 11 L14 7 L17 10" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>',
    '🤖': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="6" width="10" height="10" rx="1" fill="#6B7280"/><circle cx="8" cy="10" r="1" fill="white"/><circle cx="12" cy="10" r="1" fill="white"/><rect x="8" y="13" width="4" height="1" fill="white"/><rect x="9" y="2" width="2" height="4" fill="#6B7280"/></svg>',
    '🔄': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10 C4 6 6.7 3 10 3 C13.3 3 16 6 16 10" stroke="#3B82F6" stroke-width="1.5" fill="none"/><path d="M16 10 C16 14 13.3 17 10 17 C6.7 17 4 14 4 10" stroke="#3B82F6" stroke-width="1.5" fill="none"/><polyline points="13,3 16,3 16,6" fill="#3B82F6"/><polyline points="7,17 4,17 4,14" fill="#3B82F6"/></svg>',
    '🔁': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6 L16 6 L16 10" stroke="#10B981" stroke-width="1.5" fill="none"/><path d="M16 14 L4 14 L4 10" stroke="#10B981" stroke-width="1.5" fill="none"/><polyline points="13,3 16,6 13,9" fill="#10B981"/><polyline points="7,11 4,14 7,17" fill="#10B981"/></svg>',
    '🔀': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4 L10 10 L3 16" stroke="#6B7280" stroke-width="1.5" fill="none"/><path d="M17 4 L10 10 L17 16" stroke="#6B7280" stroke-width="1.5" fill="none"/></svg>',
    '✂': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" stroke="#6B7280" stroke-width="1.5" fill="none"/><circle cx="5" cy="15" r="2" stroke="#6B7280" stroke-width="1.5" fill="none"/><line x1="7" y1="7" x2="15" y2="13" stroke="#6B7280" stroke-width="1.5"/><line x1="7" y1="13" x2="15" y2="7" stroke="#6B7280" stroke-width="1.5"/></svg>',
    '💎': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="10,3 15,7 10,17 5,7" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1"/></svg>',
    '💯': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="10" y="14" text-anchor="middle" font-size="12" fill="#EF4444" font-weight="bold">100</text></svg>',
    '❄': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="3" x2="10" y2="17" stroke="#60A5FA" stroke-width="1.5"/><line x1="3" y1="10" x2="17" y2="10" stroke="#60A5FA" stroke-width="1.5"/><line x1="5" y1="5" x2="15" y2="15" stroke="#60A5FA" stroke-width="1.5"/><line x1="15" y1="5" x2="5" y2="15" stroke="#60A5FA" stroke-width="1.5"/></svg>',
    '🧊': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="10" height="10" fill="#DBEAFE" stroke="#60A5FA" stroke-width="1.5"/></svg>',
    '🌙': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3 C8 3 5 6 5 10 C5 14 8 17 12 17 C8 17 5 14 5 10 C5 6 8 3 12 3 M12 3 C14 4 15 6 15 10 C15 14 14 16 12 17" fill="#FCD34D"/></svg>',
    '🎄': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="10,2 6,8 7,8 4,13 5,13 2,18 18,18 15,13 16,13 13,8 14,8" fill="#10B981"/><rect x="9" y="16" width="2" height="2" fill="#B45309"/></svg>',
    '🎮': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="14" height="7" rx="2" fill="#6B7280"/><circle cx="7" cy="10" r="1.5" fill="#1F2937"/><circle cx="13" cy="10" r="1.5" fill="#EF4444"/></svg>',
    '🎤': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="2" width="4" height="8" rx="2" fill="#3B82F6"/><path d="M6 9 C6 11.5 8 13 10 13 C12 13 14 11.5 14 9" stroke="#3B82F6" stroke-width="1.5" fill="none"/><line x1="10" y1="13" x2="10" y2="17" stroke="#3B82F6" stroke-width="1.5"/><line x1="7" y1="17" x2="13" y2="17" stroke="#3B82F6" stroke-width="1.5"/></svg>',
    '👗': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4 L8 2 L10 4 L12 2 L14 4 L14 18 L6 18 Z" fill="#EC4899"/><rect x="7" y="10" width="6" height="1" fill="#DB2777"/></svg>',
    '👕': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4 L8 2 L10 4 L12 2 L14 4 L16 6 L16 18 L4 18 L4 6 Z" fill="#3B82F6"/><circle cx="10" cy="4" r="2" fill="#60A5FA"/></svg>',
    '🏥': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="12" height="14" fill="#EF4444"/><rect x="8" y="7" width="4" height="7" fill="white"/><rect x="6" y="10" width="8" height="2" fill="white"/></svg>',
    '🏖': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="5" r="2" fill="#FCD34D"/><path d="M2 12 L18 12 C18 15 16 17 13 17 L7 17 C4 17 2 15 2 12" fill="#60A5FA"/><path d="M2 12 L18 12" stroke="#FCD34D" stroke-width="3"/></svg>',
    '💍': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="13" rx="6" ry="3" stroke="#F59E0B" stroke-width="1.5" fill="none"/><polygon points="10,5 12,10 8,10" fill="#3B82F6"/></svg>',
    '✉': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="16" height="10" rx="1" stroke="#3B82F6" stroke-width="1.5" fill="none"/><polyline points="2,6 10,11 18,6" stroke="#3B82F6" stroke-width="1.5" fill="none"/></svg>',
    '🤹': '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="4" r="2" fill="#EF4444"/><circle cx="6" cy="10" r="2" fill="#3B82F6"/><circle cx="14" cy="10" r="2" fill="#10B981"/><line x1="10" y1="6" x2="10" y2="14" stroke="#6B7280" stroke-width="1.5"/></svg>',
};

function replaceEmojisInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let replacementCount = 0;

    // Replace each emoji
    for (const [emoji, replacement] of Object.entries(emojiReplacements)) {
        const regex = new RegExp(emoji, 'g');
        const matches = content.match(regex);
        if (matches) {
            content = content.replace(regex, replacement);
            replacementCount += matches.length;
        }
    }

    if (replacementCount > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ ${filePath}: ${replacementCount} replacements`);
    }

    return replacementCount;
}

// Get all HTML files
const files = fs.readdirSync('.')
    .filter(f => f.match(/pillar.*\.html$/) || f === 'index.html');

let totalReplacements = 0;
files.forEach(file => {
    totalReplacements += replaceEmojisInFile(file);
});

console.log(`\n✅ Complete! Total replacements: ${totalReplacements}`);
