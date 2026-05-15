import {
  buildPackageJson,
  buildTsConfig,
  buildViteConfig,
  buildIndexHtml,
  buildEntryFile,
  GITIGNORE,
} from "../_shared/base.js";

export const dashboardTemplate: Record<string, string> = {
  "package.json": buildPackageJson({ hasTailwind: true, hasUI: true }),
  "tsconfig.json": buildTsConfig(),
  "vite.config.ts": buildViteConfig(true),
  "index.html": buildIndexHtml({
    fonts: [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    ],
  }),
  ".gitignore": GITIGNORE,
  "src/index.tsx": buildEntryFile({ hasLayout: true, hasCss: true }),

  "src/styles.css": `@import "tailwindcss";

@theme {
  --color-brand-50: #f0fdf4;
  --color-brand-100: #dcfce7;
  --color-brand-200: #bbf7d0;
  --color-brand-300: #86efac;
  --color-brand-400: #4ade80;
  --color-brand-500: #22c55e;
  --color-brand-600: #16a34a;
  --color-brand-700: #15803d;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  @apply bg-gray-50 text-gray-900 font-sans;
}`,

  "src/routes/_layout.tsx": `import type { RouteComponent } from '@emberkit/core';
import { signal } from '@emberkit/core';
import { Sidebar, Header } from '@emberkit/ui';

const Layout: RouteComponent = ({ children }) => {
  const sidebarOpen = signal(true);

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'grid' },
    { label: 'Analytics', href: '/analytics', icon: 'chart' },
    { label: 'Users', href: '/users', icon: 'users' },
    { label: 'Projects', href: '/projects', icon: 'folder' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar
        logo={<span className="font-bold text-lg">&#9889; {{name}}</span>}
        items={sidebarItems}
        collapsed={!sidebarOpen.value}
        onToggle={() => { sidebarOpen.value = !sidebarOpen.value; }}
        className="w-64"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Dashboard"
          user={{ name: 'User', avatar: '' }}
          onMenuClick={() => { sidebarOpen.value = !sidebarOpen.value; }}
        />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;`,

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Card, Badge } from '@emberkit/ui';

const DashboardPage: RouteComponent = () => {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+20.1%', positive: true },
    { label: 'Active Users', value: '2,338', change: '+15.3%', positive: true },
    { label: 'New Signups', value: '1,247', change: '+8.2%', positive: true },
    { label: 'Churn Rate', value: '2.4%', change: '-0.5%', positive: true },
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'created a new project', time: '2 minutes ago' },
    { user: 'Jane Smith', action: 'upgraded to Pro plan', time: '15 minutes ago' },
    { user: 'Mike Johnson', action: 'invited 3 team members', time: '1 hour ago' },
    { user: 'Sarah Williams', action: 'published a new post', time: '2 hours ago' },
    { user: 'Alex Brown', action: 'deleted an old project', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="lg">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <Badge variant={stat.positive ? 'success' : 'danger'} size="sm" className="mt-2">
              {stat.change}
            </Badge>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <Card padding="lg">
          <h3 className="font-semibold mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Chart placeholder - integrate your preferred charting library
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding="lg">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm">
                  {item.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{item.user}</span> {item.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card padding="lg">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'New Project', icon: '+' },
            { label: 'Invite User', icon: '&#128100;' },
            { label: 'View Reports', icon: '&#128202;' },
            { label: 'Settings', icon: '&#9881;' },
          ].map((action) => (
            <button
              key={action.label}
              className="p-4 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-colors text-center"
            >
              <span className="text-2xl block mb-2">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;`,

  "src/routes/users.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Card, Badge, Button, Input } from '@emberkit/ui';
import { signal } from '@emberkit/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastActive: '2 min ago' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', lastActive: '1 hour ago' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer', status: 'inactive', lastActive: '3 days ago' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Editor', status: 'active', lastActive: '5 min ago' },
  { id: 5, name: 'Alex Brown', email: 'alex@example.com', role: 'Viewer', status: 'pending', lastActive: 'Never' },
];

const UsersPage: RouteComponent = () => {
  const search = signal('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase())
  );

  const statusVariant = (status: User['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'pending': return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-600 mt-1">Manage your team members and their roles.</p>
        </div>
        <Button variant="primary">Add User</Button>
      </div>

      <Card padding="lg">
        <div className="mb-4">
          <Input
            placeholder="Search users..."
            value={search.value}
            onInput={(e) => { search.value = e.currentTarget.value; }}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Last Active</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4">
                    <Badge variant={statusVariant(user.status)} size="sm">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{user.lastActive}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-brand-600 hover:underline text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;`,

  "src/routes/settings.tsx": `import type { RouteComponent } from '@emberkit/core';
import { Card, Input, Button, Alert } from '@emberkit/ui';
import { signal } from '@emberkit/core';

const SettingsPage: RouteComponent = () => {
  const name = signal('John Doe');
  const email = signal('john@example.com');
  const saved = signal(false);

  const handleSave = (e: Event) => {
    e.preventDefault();
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences.</p>
      </div>

      {saved.value && (
        <Alert variant="success">Settings saved successfully!</Alert>
      )}

      <Card padding="lg">
        <h3 className="font-semibold mb-6">Profile</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={name.value}
            onInput={(e) => { name.value = e.currentTarget.value; }}
          />
          <Input
            label="Email"
            type="email"
            value={email.value}
            onInput={(e) => { email.value = e.currentTarget.value; }}
          />
          <div className="flex justify-end">
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>

      <Card padding="lg">
        <h3 className="font-semibold mb-6">Password</h3>
        <form className="space-y-4">
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
          <Input label="Confirm Password" type="password" />
          <div className="flex justify-end">
            <Button variant="primary">Update Password</Button>
          </div>
        </form>
      </Card>

      <Card padding="lg" className="border-red-200">
        <h3 className="font-semibold mb-2 text-red-600">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back.
        </p>
        <Button variant="danger">Delete Account</Button>
      </Card>
    </div>
  );
};

export default SettingsPage;`,
};