// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FarmerProcurement {

    struct Procurement {
        string farmerId;
        string procurementId;
        string crop;
        uint256 quantity;
        uint256 pricePerKg;
        string centreId;
        uint256 timestamp;
    }

    mapping(string => Procurement) public procurements;

    function recordProcurement(
        string memory farmerId,
        string memory procurementId,
        string memory crop,
        uint256 quantity,
        uint256 pricePerKg,
        string memory centreId
    ) public {
        procurements[procurementId] = Procurement(
            farmerId,
            procurementId,
            crop,
            quantity,
            pricePerKg,
            centreId,
            block.timestamp
        );
    }

    function getProcurement(string memory procurementId)
        public
        view
        returns (Procurement memory)
    {
        return procurements[procurementId];
    }
}