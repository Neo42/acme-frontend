"use client";

import { useEffect, useState } from "react";

import { debounce } from "lodash";

import { Header } from "@/app/components/header";
import { ProjectCard } from "@/app/components/project-card";
import { TaskCard } from "@/app/components/task-card";
import { UserCard } from "@/app/components/user-card";
import { useSearchQuery } from "@/state/api";

const SearchPage = () => {
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const debouncedSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 200);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debouncedSearch(e);
  };

  useEffect(() => {
    return debouncedSearch.cancel();
  }, [debouncedSearch]);

  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={value}
          onChange={handleSearch}
          className="w-1/2 rounded border p-3 shadow"
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred while fetching search results.</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <h1>Tasks</h1>
            )}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {searchResults.projects && searchResults.projects.length > 0 && (
              <h1>Projects</h1>
            )}
            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {searchResults.users && searchResults.users.length > 0 && (
              <h1>Users</h1>
            )}
            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
