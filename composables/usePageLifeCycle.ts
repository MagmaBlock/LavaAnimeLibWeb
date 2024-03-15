const pageLifeCycle = {
  clickCount: 0,
  mountTime: null as Date | null,
};

export const usePageLifeCycle = () => {
  return {
    addClickCount: () => {
      pageLifeCycle.clickCount++;
    },
    getClickCount: () => {
      return pageLifeCycle.clickCount;
    },
    setPageMount: () => {
      pageLifeCycle.mountTime = new Date();
    },
    getPageMount: () => {
      return pageLifeCycle.mountTime;
    },
  };
};
