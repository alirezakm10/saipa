export const ModalVariants = {
    initial: {
      opacity: 0,
      zIndex:3,
    },
    visible: {
      opacity: 1,
      zIndex:3,
      transition: {
        duration: 0.4,
      }
    },
    hidden: {
      opacity: 0,
    }
  };