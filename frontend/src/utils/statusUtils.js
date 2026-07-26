export const getDynamicStatus = (hackathon) => {
  if (!hackathon || !hackathon.startDate || !hackathon.endDate) {
    return hackathon?.status || 'UNKNOWN';
  }
  
  const now = new Date();
  const start = new Date(hackathon.startDate);
  const end = new Date(hackathon.endDate);
  
  if (now < start) return 'UPCOMING';
  if (now >= start && now <= end) return 'ONGOING';
  return 'ENDED';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'UPCOMING': return 'bg-blue-500/10 text-blue-400';
    case 'ONGOING': return 'bg-green-500/10 text-green-400';
    case 'ENDED': return 'bg-neutral-500/10 text-neutral-400';
    // Fallbacks for raw backend statuses if they sneak through
    case 'ACTIVE': return 'bg-green-500/10 text-green-400';
    case 'COMPLETED': return 'bg-neutral-500/10 text-neutral-400';
    default: return 'bg-neutral-500/10 text-neutral-400';
  }
};
