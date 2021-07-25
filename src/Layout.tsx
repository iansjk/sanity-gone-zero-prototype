/** @jsxImportSource @emotion/react */

const Layout: React.FC = ({ children }) => {
  return <main css={styles}>{children}</main>;
};
export default Layout;

const styles = (theme) => ({
  fontFamily: theme.typography.body.family,
  fontSize: theme.typography.body.size,
  color: theme.palette.white,
  backgroundColor: theme.palette.background,
  padding: theme.spacing(2),
});