import Script from 'next/script'
import Meta from './Meta';

const Layout = ({ children }) => {
  return(
    <>
      <Meta />
      <Script src="https://kit.fontawesome.com/6ce15ea8d9.js" crossorigin="anonymous" />
      {children}
    </>
  );
};

export default Layout;