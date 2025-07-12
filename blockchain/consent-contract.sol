// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConsentContract {
    struct Consent {
        address dataOwner;
        address dataRequester;
        string dataType;
        uint256 timestamp;
        bool isActive;
        uint256 expirationTime;
    }
    
    mapping(bytes32 => Consent) public consents;
    mapping(address => bytes32[]) public userConsents;
    
    event ConsentGranted(
        bytes32 indexed consentId,
        address indexed dataOwner,
        address indexed dataRequester,
        string dataType,
        uint256 expirationTime
    );
    
    event ConsentRevoked(
        bytes32 indexed consentId,
        address indexed dataOwner
    );
    
    modifier onlyDataOwner(bytes32 consentId) {
        require(consents[consentId].dataOwner == msg.sender, "Not authorized");
        _;
    }
    
    function grantConsent(
        address _dataRequester,
        string memory _dataType,
        uint256 _duration
    ) external returns (bytes32) {
        bytes32 consentId = keccak256(
            abi.encodePacked(
                msg.sender,
                _dataRequester,
                _dataType,
                block.timestamp
            )
        );
        
        consents[consentId] = Consent({
            dataOwner: msg.sender,
            dataRequester: _dataRequester,
            dataType: _dataType,
            timestamp: block.timestamp,
            isActive: true,
            expirationTime: block.timestamp + _duration
        });
        
        userConsents[msg.sender].push(consentId);
        
        emit ConsentGranted(
            consentId,
            msg.sender,
            _dataRequester,
            _dataType,
            block.timestamp + _duration
        );
        
        return consentId;
    }
    
    function revokeConsent(bytes32 consentId) external onlyDataOwner(consentId) {
        require(consents[consentId].isActive, "Consent already inactive");
        
        consents[consentId].isActive = false;
        
        emit ConsentRevoked(consentId, msg.sender);
    }
    
    function isConsentValid(bytes32 consentId) external view returns (bool) {
        Consent memory consent = consents[consentId];
        return consent.isActive && 
               consent.expirationTime > block.timestamp;
    }
    
    function getConsent(bytes32 consentId) external view returns (
        address dataOwner,
        address dataRequester,
        string memory dataType,
        uint256 timestamp,
        bool isActive,
        uint256 expirationTime
    ) {
        Consent memory consent = consents[consentId];
        return (
            consent.dataOwner,
            consent.dataRequester,
            consent.dataType,
            consent.timestamp,
            consent.isActive,
            consent.expirationTime
        );
    }
    
    function getUserConsents(address user) external view returns (bytes32[] memory) {
        return userConsents[user];
    }
}