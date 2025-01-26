import { Header } from "@/app/components/header";

const SettingsPage = () => {
  const userSettings = {
    username: "John Doe",
    email: "john.doe@example.com",
    teamName: "Developer Team",
    roleName: "Developer",
  };

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Username
          </label>
          <div className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:text-white">
            {userSettings.username}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Email
          </label>
          <div className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:text-white">
            {userSettings.email}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Team
          </label>
          <div className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:text-white">
            {userSettings.teamName}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white">
            Role
          </label>
          <div className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:text-white">
            {userSettings.roleName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
