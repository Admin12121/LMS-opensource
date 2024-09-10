import React, { useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  DropdownMenu as DropdownMenuNext,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  SortDescriptor,
  Selection,
} from "@nextui-org/table";
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Badge as Chip } from "@/components/ui/badge";
import { User } from "@nextui-org/user";
import { Pagination } from "@nextui-org/pagination";
import { Input } from "@nextui-org/input";
import { Button } from "@/components/ui/button";
import { SpinnerLoader as Spinner } from "@/components/ui/spinner";
import { IoIosClose } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { HiDotsHorizontal as VerticalDotsIcon } from "react-icons/hi";
import { IoIosArrowDown as ChevronDownIcon } from "react-icons/io";
import { CiSearch as SearchIcon } from "react-icons/ci";

import { useRouter } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

const statusOptions = [
  { name: "Published", uid: "i_published" },
  { name: "Draft", uid: "draft" },
];

interface CreatedBy {
  id: number;
  email: string;
  profile: string | null;
  username: string;
}

interface FileData {
  id: number;
  created_by: CreatedBy;
  fileslug: string;
  filename: string;
  archive: boolean;
  created_at: string;
  updated_at: string;
  team: string | null;
}

interface ApiResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  page_size: number;
  results: FileData[];
}

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "FILENAME", uid: "filename", sortable: true },
  { name: "CREATED BY", uid: "created_by", sortable: true },
  { name: "ARCHIVE", uid: "archive", sortable: true },
  { name: "CREATED AT", uid: "created_at", sortable: true },
  { name: "UPDATED AT", uid: "updated_at", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "filename",
  "created_by",
  "archive",
  "created_at",
  "updated_at",
  "actions",
];

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function UserTable({
  SetExcludeBy,
  data,
  setSearch,
  isLoading,
  dataperpage,
  refetch,
  page,
  setPage,
  exclude_by,
}: {
  exclude_by: string;
  SetExcludeBy: any;
  isLoading: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => void;
  data: ApiResponse;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  dataperpage: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [searchValue, setsearchValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [server, setServer] = React.useState<boolean>(false);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [file, setFile] = React.useState<FileData[]>([]);
  const [totalFiles, setTotalFiles] = React.useState<number>(0);
  const pages = Math.ceil(totalFiles / rowsPerPage);
  const [DeleteModalId, setDeleteModalId] = React.useState<number | null>(null);
  const [user, setUser] = React.useState<FileData | null>(null);

  useEffect(() => {
    if (data) {
      setFile(data.results);
      setTotalFiles(data.count);
    }
  }, [data, page, exclude_by]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...file];
    if (statusFilter !== "all") {
      const selectedStatuses = Array.from(statusFilter);

      const excludedStatuses = statusOptions
        .map((option) => option.uid)
        .filter((status) => !selectedStatuses.includes(status));

      const oppositeStatuses = excludedStatuses.map((status) => {
        if (status === "active") return "blocked";
        if (status === "blocked") return "active";
        return status;
      });

      SetExcludeBy(oppositeStatuses);
    }

    return filteredUsers;
  }, [file, page, filterValue, statusFilter, SetExcludeBy]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: FileData, b: FileData) => {
      const first = a[sortDescriptor.column as keyof FileData] as number;
      const second = b[sortDescriptor.column as keyof FileData] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, file, page, statusFilter, exclude_by]);

  const renderCell = React.useCallback(
    (user: FileData, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof FileData];

      switch (columnKey) {
        case "filename":
          return <span>{user.filename}</span>;
        case "archive":
          return (
            <Chip
              variant="secondary"
              className="capitalize border-none gap-1 text-default-600"
            >
              {user.archive ? "Archived" : "Active"}
            </Chip>
          );
        case "created_by":
          return (
            <User
              avatarProps={{
                radius: "full",
                size: "sm",
                src: user?.created_by.profile as string,
                name: `${user.created_by.username.slice(0, 1)}`,
                classNames: {
                  base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B] cursor-pointer",
                  icon: "text-black/80",
                },
              }}
              classNames={{
                description: "text-default-500",
                name: "cursor-pointer",
              }}
              description={user.created_by.email}
              name={`${user.created_by.username}`}
            >
              {user.created_by.email}
            </User>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <DropdownMenuNext>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                  >
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setUser(user);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/workspace/${user.fileslug}`)
                    }
                  >
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeleteModalId(user.id)}>
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuNext>
            </div>
          );
        default:
          return <span>{String(cellValue)}</span>; // Convert non-ReactNode types to string
      }
    },
    []
  );

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dataperpage(Number(e.target.value));
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const onSearchChange = (value?: string) => {
    if (value) {
      setsearchValue(value);
      setSearch(value);
      setPage(1);
    } else {
      setFilterValue("");
      setsearchValue("");
      setSearch("");
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1 border-default-100",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={searchValue}
            variant="bordered"
            onClear={() => setsearchValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="secondary"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  size="sm"
                  variant="secondary"
                  endContent={<ChevronDownIcon className="text-small" />}
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              variant="default"
              onClick={() => router.push("/workspace/create")}
              className="h-8 px-2 lg:px-3 border-dashed font-normal text-xs"
            >
              <PlusCircledIcon className=" h-4 w-4" />
              New Workspace
            </Button>
            <Button
              size="sm"
              variant="secondary"
              color="default"
              onClick={() => {
                refetch();
                console.log("refetched");
              }}
            >
              <IoReload className="text-small" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalFiles} Files
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small cursor-pointer"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    server,
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    file.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{ cursor: "bg-foreground text-background" }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <>
      <Table
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: any) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No users found"}
          items={sortedItems}
          isLoading={isLoading}
          loadingContent={
            <span className="h-[50vh] flex items-center justify-center">
              <Spinner color="default" />
            </span>
          }
        >
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey: any) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
