// AuditContract.js - JavaScript implementation
class AuditContract {
    constructor() {
        this.audits = new Map();
        this.authorizedAuditors = new Set();
        this.auditCounter = 0;
        this.owner = null; // Set this to the deployer's address
        
        // Add owner as authorized auditor
        if (this.owner) {
            this.authorizedAuditors.add(this.owner);
        }
    }
    
    // Modifier functions
    onlyOwner(caller) {
        if (caller !== this.owner) {
            throw new Error("Only owner can perform this action");
        }
    }
    
    onlyAuthorizedAuditor(caller) {
        if (!this.authorizedAuditors.has(caller)) {
            throw new Error("Only authorized auditors can perform this action");
        }
    }
    
    setOwner(ownerAddress) {
        this.owner = ownerAddress;
        this.authorizedAuditors.add(ownerAddress);
    }
    
    authorizeAuditor(caller, auditorAddress) {
        this.onlyOwner(caller);
        this.authorizedAuditors.add(auditorAddress);
        console.log(`Auditor ${auditorAddress} authorized`);
    }
    
    revokeAuditor(caller, auditorAddress) {
        this.onlyOwner(caller);
        this.authorizedAuditors.delete(auditorAddress);
        console.log(`Auditor ${auditorAddress} revoked`);
    }
    
    createAudit(caller, description) {
        this.onlyAuthorizedAuditor(caller);
        this.auditCounter++;
        
        const auditRecord = {
            id: this.auditCounter,
            auditor: caller,
            description: description,
            timestamp: Date.now(),
            isCompleted: false,
            result: ""
        };
        
        this.audits.set(this.auditCounter, auditRecord);
        console.log(`Audit created: ID ${this.auditCounter}, Auditor: ${caller}`);
        return this.auditCounter;
    }
    
    completeAudit(caller, auditId, result) {
        this.onlyAuthorizedAuditor(caller);
        
        const audit = this.audits.get(auditId);
        if (!audit) {
            throw new Error("Audit does not exist");
        }
        
        if (audit.auditor !== caller) {
            throw new Error("Only the assigned auditor can complete this audit");
        }
        
        if (audit.isCompleted) {
            throw new Error("Audit already completed");
        }
        
        audit.isCompleted = true;
        audit.result = result;
        
        console.log(`Audit completed: ID ${auditId}, Result: ${result}`);
    }
    
    getAudit(auditId) {
        const audit = this.audits.get(auditId);
        if (!audit) {
            throw new Error("Audit does not exist");
        }
        return audit;
    }
    
    getTotalAudits() {
        return this.auditCounter;
    }
    
    isAuthorizedAuditor(address) {
        return this.authorizedAuditors.has(address);
    }
}

module.exports = AuditContract;