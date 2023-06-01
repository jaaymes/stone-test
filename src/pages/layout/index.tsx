interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <main className="bg-gray-100 p-6">{children}</main>
}

export default Layout
