export const logdev = (message: any) => {
    if (process.env.NEXT_PUBLIC_SHOW_DEV_LOGS === 'true') {
      console.log(message as string);
      return;
    } else {
      return;
    }
};