// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address seller;
        bool sold;
    }

    IERC20 public token;
    address public owner;
    uint256 public modelCount;
    mapping(uint256 => Model) public models;

    event ModelListed(uint256 modelId, string name, uint256 price, address seller);
    event ModelPurchased(uint256 modelId, address buyer);

    constructor(address _tokenAddress) payable {
        token = IERC20(_tokenAddress);
        owner = msg.sender;
    }

    function listModel(string memory _name, string memory _description, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");
        models[++modelCount] = Model(_name, _description, _price, msg.sender, false);
        emit ModelListed(modelCount, _name, _price, msg.sender);
    }

    function purchaseModel(uint256 _modelId) public {
        Model storage model = models[_modelId];
        require(!model.sold, "Model already sold");
        require(token.transferFrom(msg.sender, model.seller, model.price), "Token transfer failed");

        model.sold = true;
        emit ModelPurchased(_modelId, msg.sender);
    }

    function getModelDetails(uint256 _modelId) public view returns (string memory, string memory, uint256, address, bool) {
        Model storage model = models[_modelId];
        return (model.name, model.description, model.price, model.seller, model.sold);
    }
}
