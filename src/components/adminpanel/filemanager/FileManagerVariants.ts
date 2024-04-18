export const FileManagerVariants = {
    initial: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        opacity: { duration:0 },
      },
    },
    hidden: {
      opacity: 0,
      zIndex: 0,
    },
  };
  