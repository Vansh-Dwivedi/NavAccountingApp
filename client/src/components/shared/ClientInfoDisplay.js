import React from "react";
import { Descriptions, Tabs, Card } from "antd";
import moment from "moment";
import ClientFinancialDataForm from "../Forms/ClientFinancialDataForm";

const { TabPane } = Tabs;

const ClientInfoDisplay = ({ clientData, handleFinancialDataUpdate, loading }) => {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Personal Info" key="1">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Full Name">
              {clientData.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {clientData.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {clientData.email}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {`${clientData.addressLine1} ${clientData.addressLine2 || ""}`}
            </Descriptions.Item>
            <Descriptions.Item label="Filing Status">
              {clientData.filingStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Occupation">
              {clientData.occupation}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="Business Info" key="2">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Business Name">
              {clientData.businessName}
            </Descriptions.Item>
            <Descriptions.Item label="Business Phone">
              {clientData.businessPhone}
            </Descriptions.Item>
            <Descriptions.Item label="Business Email">
              {clientData.businessEmail}
            </Descriptions.Item>
            <Descriptions.Item label="Entity Type">
              {clientData.businessEntityType}
            </Descriptions.Item>
            <Descriptions.Item label="TIN">
              {clientData.businessTIN}
            </Descriptions.Item>
            <Descriptions.Item label="Active Employees">
              {clientData.noOfEmployeesActive}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="Financial Info" key="3">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Account Type">
              {clientData.accountType}
            </Descriptions.Item>
            <Descriptions.Item label="Account Status">
              {clientData.accountStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Risk Profile">
              {clientData.investmentRiskProfile}
            </Descriptions.Item>
            <Descriptions.Item label="Tax Filing Status">
              {clientData.taxFilingStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Last Tax Return">
              {clientData.lastTaxReturnDate &&
                moment(clientData.lastTaxReturnDate).format("MM/DD/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="Compliance Info" key="4">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="KYC Status">
              {clientData.kycStatus}
            </Descriptions.Item>
            <Descriptions.Item label="AML Status">
              {clientData.amlStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Compliance Status">
              {clientData.complianceStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Risk Tolerance Level">
              {clientData.riskToleranceLevel}
            </Descriptions.Item>
            <Descriptions.Item label="Investment Risk Profile">
              {clientData.investmentRiskProfile}
            </Descriptions.Item>
            <Descriptions.Item label="Documents">
              {clientData.documents &&
                clientData.documents.map((doc, index) => (
                  <div key={index}>{doc}</div>
                ))}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <Tabs.TabPane tab="Miscellaneous" key="5">
          <ClientFinancialDataForm
            initialData={clientData}
            onSubmit={handleFinancialDataUpdate}
            loading={loading}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default ClientInfoDisplay;
