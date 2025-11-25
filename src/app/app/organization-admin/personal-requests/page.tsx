"use client";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { formatDistanceToNowStrict } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function PersonalRequestsPage() {
    const [tab, setTab] = React.useState<"pending" | "accepted">("pending");
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const statusMap = { pending: "PENDING", accepted: "ACCEPTED" } as const;
    const { data, isLoading, refetch } = api.organization.getJoinRequests.useQuery({ status: statusMap[tab] });

    const cancelRequest = api.team.cancelJoinRequest.useMutation({
        onSuccess: () => {
            toast.success("Request deleted");
            setDeleteId(null);
            refetch();
        },
        onError: (err: { message?: string }) => {
            toast.error(err.message ?? "Error deleting request");
            setDeleteId(null);
        },
    });

    const mappedData: {
        id: string;
        organization: { name: string };
        requestedAt: string;
        acceptedAt?: string;
        status: "pending" | "accepted";
    }[] = React.useMemo(() => {
        if (!data) return [];
        return data
            .filter((r: any) =>
                tab === "pending" ? r.status === "PENDING" : r.status === "ACCEPTED"
            )
            .map((r: any) => ({
                id: String(r.id),
                organization: { name: r.organization?.name ?? r.user?.name ?? r.email ?? "Unknown" },
                requestedAt: r.createdAt ? String(r.createdAt) : "",
                acceptedAt: r.status === "ACCEPTED" ? String(r.createdAt) : undefined,
                status: r.status === "PENDING" ? "pending" : "accepted",
            }));
    }, [data, tab]);

    const paged = React.useMemo(() => {
        const start = (page - 1) * pageSize;
        return mappedData.slice(start, start + pageSize);
    }, [mappedData, page, pageSize]);

    const totalPages = Math.max(1, Math.ceil(mappedData.length / pageSize));

    React.useEffect(() => {
        setPage(1);
    }, [tab, pageSize]);

    return (
        <div className="px-8 py-6">
            <h1 className="text-xl font-semibold mb-2">Join Requests</h1>
            <p className="mb-6 text-muted-foreground">Review and respond to pending membership requests.</p>

            <Tabs value={tab} onValueChange={v => setTab(v as "pending" | "accepted")}>
                <TabsList className="bg-[#e1f2fe] w-full mb-6">
                    <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
                    <TabsTrigger value="accepted" className="flex-1">Accepted</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    <RequestTable
                        requests={paged}
                        tab="pending"
                        isLoading={isLoading}
                        onDelete={id => setDeleteId(id)}
                    />
                </TabsContent>
                <TabsContent value="accepted">
                    <RequestTable
                        requests={paged}
                        tab="accepted"
                        isLoading={isLoading}
                    />
                </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-2">
                    <Select value={pageSize.toString()} onValueChange={v => setPageSize(Number(v))}>
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map(opt => (
                                <SelectItem key={opt} value={opt.toString()}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-sm w-48 ml-2">per page</span>
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={page === 1 ? undefined : () => setPage(1)}
                                className={page === 1 ? "pointer-events-none opacity-60" : ""}
                            >
                                &laquo;
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={page === 1 ? undefined : () => setPage(p => Math.max(1, p - 1))}
                                className={page === 1 ? "pointer-events-none opacity-60" : ""}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="px-2">Page {page} of {totalPages}</span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={page === totalPages ? undefined : () => setPage(p => Math.min(totalPages, p + 1))}
                                className={page === totalPages ? "pointer-events-none opacity-60" : ""}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={page === totalPages ? undefined : () => setPage(totalPages)}
                                className={page === totalPages ? "pointer-events-none opacity-60" : ""}
                            >
                                &raquo;
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Join Request?</DialogTitle>
                    </DialogHeader>
                    <div className="mb-4">
                        Are you sure you want to cancel your join request? This action cannot be undone.
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteId && cancelRequest.mutate({ requestId: deleteId })}
                            disabled={cancelRequest.isLoading}
                        >
                            {cancelRequest.isLoading ? "Canceling..." : "Yes, cancel request"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

type RequestTableProps = {
    requests: {
        id: string;
        organization: { name: string };
        requestedAt: string;
        acceptedAt?: string;
        status: "pending" | "accepted";
    }[];
    tab: "pending" | "accepted";
    isLoading: boolean;
    onDelete?: (id: string) => void;
};

function RequestTable({ requests, tab, isLoading, onDelete }: RequestTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>
                        {tab === "pending" ? "Requested Date" : "Accepted Date"}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    {tab === "pending" && <TableHead>Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={tab === "pending" ? 4 : 3}>
                            <div className="h-6 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                        </TableCell>
                    </TableRow>
                ) : requests.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={tab === "pending" ? 4 : 3} className="text-center text-muted-foreground">
                            No requests found.
                        </TableCell>
                    </TableRow>
                ) : (
                    requests.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{r.organization.name}</TableCell>
                            <TableCell>
                                {tab === "pending"
                                    ? formatDistanceToNowStrict(new Date(r.requestedAt), { addSuffix: true })
                                    : formatDistanceToNowStrict(new Date(r.acceptedAt ?? r.requestedAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={`border whitespace-nowrap text-sm font-medium rounded-full min-w-0 w-10 flex items-center gap-1
                    ${r.status === "pending"
                                            ? "border-yellow-400 text-yellow-700 bg-yellow-50 px-2"
                                            : "border-blue-400 text-blue-700 bg-blue-50 px-2"
                                        }`}
                                    style={{ width: "125px", minWidth: "0", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
                                >
                                    {r.status === "pending"
                                        ? <Clock className="h-4 w-4" />
                                        : <FileText className="h-4 w-4" />}
                                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                </Badge>
                            </TableCell>
                            {tab === "pending" && onDelete && (
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Delete request"
                                        onClick={() => onDelete(r.id)}
                                    >
                                        <Trash2 className="h-5 w-5 text-red-500" />
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}