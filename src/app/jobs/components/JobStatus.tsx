"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserIcon, DollarSign } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast"; // Import useToast
import { useAuth } from "@/context/auth-context";
import { SkeletonLoader } from "@/app/components/loading/SkeletonLoader";

interface takenJobsOrder {
  id: string;
  subcategory: string;
  service: string;
  customerName: string;
  orderDate: string;
  serviceDate: string;
  totalCost: number;
  idStatus: string; // UUID as string
  status: string;
  idNextStatus: string | null; // UUID as string or null
  nextStatus: string | null;
}

// const jobsData: takenJobsOrder[] = [
//   {
//     id: "1",
//     subcategory: "Tukang Ledeng Professional",
//     service: "Perbaikan Pipa Bocor",
//     customerName: "Ahmad Sudrajat",
//     orderDate: "2024-03-10",
//     serviceDate: "2024-03-20",
//     totalCost: 150000,
//     status: "Menunggu Pekerja Berangkat",
//   },
//   {
//     id: "2",
//     subcategory: "Tukang Ledeng Professional",
//     service: "Instalasi Pipa Baru",
//     customerName: "Budi Santoso",
//     orderDate: "2024-03-12",
//     serviceDate: "2024-03-22",
//     totalCost: 200000,
//     status: "Pekerja Tiba Di Lokasi",
//   },
//   {
//     id: "3",
//     subcategory: "Tukang Ledeng Professional",
//     service: "Perbaikan Pipa Bocor",
//     customerName: "Candra Wijaya",
//     orderDate: "2024-03-15",
//     serviceDate: "2024-03-25",
//     totalCost: 300000,
//     status: "Pesanan Selesai",
//   },
// ];

export function JobStatus() {
  const { user } = useAuth(); // Access authenticated user and setter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState<takenJobsOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingOrderIds, setProcessingOrderIds] = useState<Set<string>>(new Set()); 
  // const [orders, setOrders] = useState<takenJobsOrder[]>([]);

  const { toast } = useToast(); // Destructure toast from useToast

  useEffect(() => {
    if (!user?.id) {
      setError("User not authenticated.");
      return;
    }
  
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/jobs/taken_jobs?pekerjaId=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include auth headers if needed, e.g., Authorization: Bearer <token>
          },
          credentials: "include", // Include cookies if using session-based auth
          // No body for GET request
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data); // Add this line for debugging
          
          if (Array.isArray(data)) {
            const mappedOrders: takenJobsOrder[] = data.map((order: any, index: number) => {
              console.log("Order ID:", order.id); // Corrected property name
              return {
                id: order.id || `order-${index}`, // Corrected property name
                subcategory: order.namasubkategori || "Unknown Subcategory",
                service: order.namakategori || "Unknown Service",
                customerName: order.namapelanggan || "Unknown Customer",
                orderDate: order.tglpemesanan || "", // Corrected property name
                serviceDate: order.tglpekerjaan || "", // Corrected property name
                totalCost: parseFloat(order.totalbiaya) || 0, // Convert string to number
                idStatus: order.idstatus,
                status: order.status,
                idNextStatus: order.idnextstatus,
                nextStatus: order.nextstatus,
              };
            });
            setJobs(mappedOrders); // Correctly set the state
          } else {
            throw new Error("Invalid data structure received from API.");
          }
              
        } else {
          const errorData = await response.json();
          toast({
            title: "Error",
            description: errorData.message || "Failed to fetch taken job orders.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Fetch Orders Error:", error);
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [user?.id, toast]);

  const handleUpdateStatus = async (
    jobId: string,
    nextStatusId: string | null,
    nextStatus: string | null
  ) => {
    // Prevent multiple clicks
    if (processingOrderIds.has(jobId)) return;
  
    // Confirm the action with the user
    const confirmAction = window.confirm(
      "Apakah Anda yakin ingin mengupdate status pesanan ini?"
    );
    if (!confirmAction) return;
  
    // Add to processing set
    setProcessingOrderIds((prev) => new Set(prev).add(jobId));
  
    try {
      const response = await fetch("/api/jobs/taken_jobs_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({ orderId: jobId, nextStatusId }),
      });
  
      const responseData = await response.json();
      console.log("API Response:", responseData); // Add this line
  
      if (response.ok) {
        toast({
          title: "Success",
          description:
            responseData.message || "Order status processed successfully.",
          variant: "default",
        });
  
        if (responseData.data) {
          // Update the job's status and next status in the state
          console.log(responseData.data.IdStatus, responseData.data.IdNextStatus)
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.id === jobId
                ? {
                    ...job,
                    idStatus: responseData.data.idstatus,
                    status: responseData.data.status,
                    idNextStatus: responseData.data.idnextstatus,
                    nextStatus: responseData.data.nextstatus,
                  }
                : job
            )
          );
        } else {
          // Status was already applied; inform the user
          toast({
            title: "Notice",
            description: "Status has already been applied to this order.",
            variant: "default",
          });
        }
      } else {
        // Handle API errors
        toast({
          title: "Error",
          description:
            responseData.message || "Failed to update order status.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Handle Update Status Error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      // Remove from processing set
      setProcessingOrderIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };  
  

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.subcategory
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Input
          type="text"
          placeholder="Nama Jasa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto flex-grow"
        />
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Status Pesanan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Menunggu Pekerja Berangkat">
              Menunggu Pekerja Berangkat
            </SelectItem>
            <SelectItem value="Pekerja Tiba Di Lokasi">
              Pekerja Tiba Di Lokasi
            </SelectItem>
            <SelectItem value="Pelayanan Jasa Sedang Dilakukan">
              Pelayanan Jasa Sedang Dilakukan
            </SelectItem>
            <SelectItem value="Pesanan Selesai">Pesanan Selesai</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="default"
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Search
        </Button>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <SkeletonLoader variant="card"  />
      ) : (
        // Job Entries
        <div className="flex flex-col gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow p-4 border">
              <div className="flex">
                {/* Left Section */}
                <div className="flex flex-col gap-2 w-1/3">
                  <h3 className="text-lg font-bold">{job.subcategory}</h3>
                  <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm text-gray-500 border-r-2 pr-4">
                      {job.service}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <UserIcon className="w-4 h-4 text-gray-600" />
                      {job.customerName}
                    </p>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>
                      <span className=" text-gray-700">
                        Tanggal Pemesanan:
                      </span>{" "}
                      {new Date(job.orderDate).toLocaleDateString("id-ID")}
                    </p>
                    <p>
                      <span className=" text-gray-700">
                        Tanggal Pekerjaan:
                      </span>{" "}
                      {new Date(job.serviceDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Middle Section */}
                <div className="flex items-center justify-center w-1/3">
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                    <DollarSign className="w-5 h-5 text-gray-900" />
                    Rp {job.totalCost.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Right Section */}
                <div
                  className={`flex flex-col items-end ${
                    job.status === "Pekerjaan Selesai" || job.status === "Dibatalkan"
                      ? "justify-center"
                      : "justify-between"
                  } w-1/3`}
                >
                  <p
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      job.status === "Pekerjaan Selesai"
                        ? "bg-green-100 text-green-700"
                        : job.status === "Dibatalkan"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {job.status}
                  </p>
                  {job.status !== "Pekerjaan Selesai" &&
                    job.status !== "Dibatalkan" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${
                          job.status === "Pekerja Ditemukan"
                            ? "text-yellow-600 border-yellow-600"
                            : "text-blue-600 border-blue-600"
                        }`}
                        onClick={() =>
                          handleUpdateStatus(job.id, job.idNextStatus, job.nextStatus)
                        }
                        disabled={processingOrderIds.has(job.id)}
                      >

                        {processingOrderIds.has(job.id)
                        ? "Processing..."
                        : "Update Status"}

                        {/* {job.status === "Pekerja Ditemukan"
                          ? "Menuju ke Lokasi"
                          : job.status === "Pekerja Menuju ke Lokasi"
                          ? "Memproses Pelayanan"
                          : "Selesai Melakukan Pelayanan"} */}
                      </Button>
                    )}
                </div>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
