import React from "react";
import { Row, Col, Progress, message } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import EditableStatistic from "./EditableStatistic";
import api from "../../utils/api";
import EditableHistoryChart from "./EditableHistoryChart";

const FinancialMetrics = ({ data, userId, onDataUpdate }) => {
  const handleUpdate = async (field, value) => {
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        throw new Error("Invalid numeric value");
      }

      const response = await api.put(`/api/users/${userId}/financial-data`, {
        [field]: numericValue,
        dateUpdated: new Date().toISOString(),
      });

      if (onDataUpdate) {
        onDataUpdate(response.data);
      }

      message.success(`${field} updated successfully`);
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating financial data:", error);
      message.error(`Failed to update ${field}`);
      return Promise.reject(error);
    }
  };

  return (
    <div className="financial-metrics">
      <Row gutter={16}>
        <Col span={6}>
          <EditableStatistic
            title="Total Balance"
            value={data.totalBalance || 0}
            prefix={<DollarOutlined />}
            precision={2}
            onSave={(value) => handleUpdate("totalBalance", value)}
          />
        </Col>
        <Col span={6}>
          <EditableStatistic
            title="Available Balance"
            value={data.availableBalance || 0}
            prefix={<DollarOutlined />}
            precision={2}
            onSave={(value) => handleUpdate("availableBalance", value)}
          />
        </Col>
        <Col span={6}>
          <EditableStatistic
            title="Credit Score"
            value={data.creditScore || 0}
            suffix="/ 850"
            onSave={(value) => handleUpdate("creditScore", value)}
          />
          <Progress
            percent={(data.creditScore / 850) * 100}
            showInfo={false}
            status="active"
          />
        </Col>
        <Col span={6}>
          <EditableStatistic
            title="Annual Income"
            value={data.annualIncome || 0}
            prefix={<DollarOutlined />}
            precision={2}
            onSave={(value) => handleUpdate("annualIncome", value)}
          />
        </Col>
        <Col span={24}>
          <EditableHistoryChart
            title="Total Balance History"
            data={data.balanceHistory || []}
            metric="Total Balance"
            onSave={async (data) => {
              try {
                const response = await api.put(
                  `/api/users/${userId}/financial-history`,
                  {
                    type: "balance",
                    history: data,
                  }
                );
                message.success("Balance history updated successfully");
                if (onDataUpdate) {
                  onDataUpdate(response.data);
                }
              } catch (error) {
                message.error("Failed to update balance history");
                throw error;
              }
            }}
          />
        </Col>
        <Col span={24}>
          <EditableHistoryChart
            title="Credit Score History"
            data={data.creditScoreHistory || []}
            metric="Credit Score"
            onSave={async (data) => {
              try {
                const response = await api.put(
                  `/api/users/${userId}/financial-history`,
                  {
                    type: "creditScore",
                    history: data,
                  }
                );
                message.success("Credit score history updated successfully");
                if (onDataUpdate) {
                  onDataUpdate(response.data);
                }
              } catch (error) {
                message.error("Failed to update credit score history");
                throw error;
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FinancialMetrics;
