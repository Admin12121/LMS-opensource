import React, { useEffect } from "react";
import {
  DropdownMenu as DropdownMenuNext,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
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
import { formatPrice } from "@/lib/format";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { labels } from "./data";
import { Badge as Chip } from "@/components/ui/badge";
import { User } from "@nextui-org/user";
import { Pagination } from "@nextui-org/pagination";
import { Input } from "@nextui-org/input";
import { Button } from "@/components/ui/button";
import { SpinnerLoader as Spinner } from "@/components/ui/spinner";
import { IoReload } from "react-icons/io5";
import { IoIosArrowDown as ChevronDownIcon } from "react-icons/io";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { statusOptions } from "./advanceddata";
import { useRouter } from "next/navigation";
import { PlusCircledIcon } from "@radix-ui/react-icons"

interface Users {
  id: number;
  email: string;
  profile: string | null;
  username: string;
}

interface Category{
  name : string,
  categoryslug: string,
}

interface Course {
  id: number;
  image: string;
  title: string;
  user: Users;
  isPublished: boolean;
  courseslug: string;
  created_at: string;
  updated_at: string;
  price?: number | null;
  isFree: boolean;
  category?: Category;
}

interface ApiResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  page_size: number;
  results: Course[];
}

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "TITLE", uid: "title", sortable: true },
  { name: "USER", uid: "user", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["title", "user", "price", "status", "actions"];

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function NewAdvancedTable({
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
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [course, setCourse] = React.useState<Course[]>([]);
  const [totalCourse, setTotalCourse] = React.useState<number>(0);
  const pages = Math.ceil(totalCourse / rowsPerPage);
  const [DeleteModalId, setDeleteModalId] = React.useState<number | null>(null);

  useEffect(() => {
    if (data) {
      setCourse(data.results);
      setTotalCourse(data.count);
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
    let filteredUsers = [...course];
    if (statusFilter !== "all") {
      const selectedStatuses = Array.from(statusFilter);

      const excludedStatuses = statusOptions
        .map((option) => option.uid)
        .filter((status) => !selectedStatuses.includes(status));

      const oppositeStatuses = excludedStatuses.map((status) => {
        return status;
      });

      SetExcludeBy(oppositeStatuses);
    }

    return filteredUsers;
  }, [course, page, filterValue, statusFilter, SetExcludeBy]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Course, b: Course) => {
      const first = a[sortDescriptor.column as keyof Course] as number;
      const second = b[sortDescriptor.column as keyof Course] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, course, page, statusFilter, exclude_by]);

  const renderCell = React.useCallback(
    (course: Course, columnKey: React.Key) => {
      const cellValue = course[columnKey as keyof Course];

      switch (columnKey) {
        case "user":
          return (
            <User
              avatarProps={{
                radius: "full",
                size: "sm",
                src: course.user?.profile as string,
                name: `${course.user.username.slice(0, 1)}`,
                // icon: `${(<AvatarIcon />)}`,
                classNames: {
                  base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B] cursor-pointer",
                  icon: "text-black/80",
                },
              }}
              classNames={{
                description: "text-default-500",
                name: "cursor-pointer",
              }}
              description={course.user.email}
              name={`${course.user.username}`}
            >
              {course.user.email}
            </User>
          );
        case "title":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{course.title}</p>
            </div>
          );
        case "category":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{course?.category?.name ? course.category.name : "not set"}</p>
            </div>
          );
        case "price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{course?.isFree ? (<Chip
              className={`capitalize border-none gap-1 text-neutral-950`}
              variant={course.isFree ? "default" : "outline"}
            >Free</Chip>) : course?.price && formatPrice(course?.price)}</p>
            </div>
          );
        case "status":
          return (
            <Chip
              className={`capitalize border-none gap-1 text-default-600`}
              variant={course.isPublished ? "secondary" : "outline"}
            >
              {course.isPublished ? "Published" : "Draft"}
            </Chip>
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
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/courses/add-course/${course.courseslug}`)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Make a copy</DropdownMenuItem>
                  <DropdownMenuItem>Favorite</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={course.title}>
                        {labels.map((label) => (
                          <DropdownMenuRadioItem
                            key={label.value}
                            value={label.value}
                          >
                            {label.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=>setDeleteModalId(course.id)}>
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuNext>
            </div>
          );
        default:
          return cellValue;
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
                    endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="secondary"
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
              onClick={() => router.push("/courses/add-course")}
              className="h-8 px-2 lg:px-3 border-dashed font-normal text-xs"
            >
              <PlusCircledIcon className=" h-4 w-4" />
              New Course
            </Button>
            <Button
              size="sm"
              variant="secondary"
              color="default"
              onClick={() => {
                refetch();
              }}
            >
              <IoReload className="text-small" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalCourse} users
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
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    course.length,
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
          {(item: Course) => (
            <TableRow key={item.id}>
              {(columnKey: any) => (
                <TableCell>
                  {renderCell(item, columnKey) as React.ReactNode}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {DeleteModalId && (
        <DeleteModal
          DeleteModalId={DeleteModalId}
          setDeleteModalId={setDeleteModalId}
        />
      )}
    </>
  );
}

const DeleteModal = ({
  DeleteModalId,
  setDeleteModalId,
}: {
  DeleteModalId: number;
  setDeleteModalId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  return (
    <section className="flex flex-col fixed w-[100vw] h-[100vh] bg-neutral-950/50 z-50 backdrop-blur-sm top-0 left-0 items-center justify-center">
      <Card className=" rounded-lg min-h-[150px] w-[300px]">
        <CardHeader className="pb-2">
          <h1 className="text-lg font-normal">Delete Course</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-2 p-0 pb-2">
          <p className="text-xs text-default-700 font-normal">
            Are you sure you want to delete this course?
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setDeleteModalId(null)}
          >
            Cancel
          </Button>
          <Button size="sm" variant="secondary" color="danger">
            Delete
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};