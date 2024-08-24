import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";

// Function to fetch data from the API
export const fetchData = async (token) => {
  try {
    const response = await axios.get("http://localhost:8000/api/commands/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response:", response.data); // Print the full API response
    return response.data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const ProjectTables = ({ onClientClick }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const data = await fetchData(token);
        console.log("Fetched Data:", data); // Print the fetched data
        setTableData(data);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5" className="fw-bold">
            Gestion des Commandes
          </CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Surveillez, modifiez et gérez les commandes des clients.
          </CardSubtitle>

          <Table
            className="table-full-width no-wrap mt-3 align-middle"
            responsive
            borderless
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Order State</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((tdata) => (
                <tr
                  key={tdata.command_id}
                  className="border-top"
                  onClick={() => onClientClick(tdata)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="d-flex align-items-center py-2">
                      <div className="ms-0">
                        <h6 className="mb-0">{tdata.name}</h6>
                        <span className="text-muted">
                          {tdata.phone_number || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{tdata.city || "N/A"}</td>
                  <td>
                    {tdata.order_state === "PENDING" ? (
                      <div className="d-flex align-items-center">
                        <span className="p-2 bg-secondary rounded-circle d-inline-block me-2"></span>
                        <span>Pending</span>
                      </div>
                    ) : tdata.order_state === "PROCESSING" ? (
                      <div className="d-flex align-items-center">
                        <span className="p-2 bg-warning rounded-circle d-inline-block me-2"></span>
                        <span>Processing</span>
                      </div>
                    ) : tdata.order_state === "COMPLETED" ? (
                      <div className="d-flex align-items-center">
                        <span className="p-2 bg-success rounded-circle d-inline-block me-2"></span>
                        <span>Completed</span>
                      </div>
                    ) : tdata.order_state === "CANCELLED" ? (
                      <div className="d-flex align-items-center">
                        <span className="p-2 bg-danger rounded-circle d-inline-block me-2"></span>
                        <span>Cancelled</span>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProjectTables;
