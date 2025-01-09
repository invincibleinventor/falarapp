const SlugLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>Slug Header</header>
      <main>{children}</main>
    </div>
  );
};
export default SlugLayout;