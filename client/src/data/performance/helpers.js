const isWindowOpen = ({ windowClose, windowOpen }) => {
  const now = new Date().getTime();
  const close = new Date(windowClose).getTime(), open = new Date(windowOpen).getTime();

  return open <= now && now <= close;
};

export default {
  isWindowOpen
};
