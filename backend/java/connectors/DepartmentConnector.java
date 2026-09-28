package backend.java.connectors;

public interface DepartmentConnector {
    String getCode();
    String getName();
    String getEndpoint();

    String getCitizenData(String citizenId, String ssoToken, String consentToken);
    String verifyEligibility(String citizenId, String schemeId);
    String submitApplication(String applicationJson);
    String getApplicationStatus(String applicationId);
    String updateApplicationStatus(String applicationId, String status, String notes);
}
