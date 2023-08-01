// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract CryptoBridge {

    string public name = "CryptoBridge";

    //Stores FundRaising
    uint public fundRaisingsCount = 0;
    mapping(uint => string) public fundraisingsList;
    mapping(string => FundRaising) private fundraisings;
    mapping(string => mapping(uint=>Donation)) public fundraisingsdonations; //Double mapping to get each donation of any fundraising
    mapping(string => bool) private fundraisingExist;

    struct FundRaising {
        uint id;
        string string_id;
        string imghash;
        uint totalAmount;
        uint amountToRetrieve;
        uint donorCount;
        bool isOpen;
        address payable author;
    }

    event FundRaisingModified (
        FundRaising fundraising
    );
    
    struct FundRaisingDonations {
        mapping(uint=>Donation) donations;
    }

    struct Donation {
        uint amount;
        string message;
    }

    //Creates FundRaising
    function createFundRaising(string memory _string_id, string memory _imgHash) public {
        require(bytes(_string_id).length > 0, "Identification should not be empty");
        require(fundraisingExist[_string_id] == false, "There is already a fund raising with that identification");
        
        //Increment fundraisings id
        fundRaisingsCount++;

        //Add fundraising to contract
        fundraisingsList[fundRaisingsCount] = _string_id;
        FundRaising memory new_fundraising = FundRaising(fundRaisingsCount,_string_id,_imgHash,0,0,0,true,payable(msg.sender));
        fundraisings[_string_id] = new_fundraising;
        fundraisingExist[_string_id] = true;
        //Trigger event
        emit FundRaisingModified(new_fundraising);
    }

    function openFundRaising(string memory _string_id) public {
        require(bytes(_string_id).length > 0, "Identification should not be empty");
        require(fundraisings[_string_id].author == msg.sender,"Only creator can open a fundraising");
        require(!fundraisings[_string_id].isOpen,"Can't open an already open fundraising");

        fundraisings[_string_id].isOpen = true;
        emit FundRaisingModified(fundraisings[_string_id]);
    }

    function closeFundRaising(string memory _string_id) public {
        require(bytes(_string_id).length > 0, "Identification should not be empty");
        require(fundraisings[_string_id].author == msg.sender,"Only creator can close a fundraising");
        require(fundraisings[_string_id].isOpen,"Can't close an already closed fundraising");

        fundraisings[_string_id].isOpen = false;
        emit FundRaisingModified(fundraisings[_string_id]);
    }

    function donate(string memory _string_id, string memory _message) public payable {
        //Donate funds in payable
        //Update the funding
        FundRaising memory donation_fr = fundraisings[_string_id];
        require(donation_fr.isOpen);

        donation_fr.donorCount++;
        donation_fr.totalAmount += msg.value;
        donation_fr.amountToRetrieve += msg.value;

        fundraisings[_string_id] = donation_fr;

        //Get donation in donors list
        fundraisingsdonations[_string_id][donation_fr.donorCount] = Donation(msg.value, _message);

        emit FundRaisingModified(donation_fr);
        
    }

    //Given the name of a fundraising (created by the account that queries,
    //it withdraws the pending tokens stored in the contract. Balances are updated
    function withdrawFunds(string memory _string_id) public {
        require(bytes(_string_id).length > 0, "Identification should not be empty");
        require(msg.sender == fundraisings[_string_id].author, "Only the author can retrieve funds");
        require(fundraisings[_string_id].amountToRetrieve > 0 ,"There's no funds to retrieve");

        uint256 amount = fundraisings[_string_id].amountToRetrieve;

        address payable owner = payable(msg.sender);

        owner.transfer(amount); 
        fundraisings[_string_id].amountToRetrieve = 0;

        emit FundRaisingModified(fundraisings[_string_id]);
    }

    //Getters

    /*
    //STRUCTS
    struct FundRaising {
        address creator;
        uint256 totalAmount;
        uint256 amountToRetrieve;
        uint256 donorCount;
        bool isOpen;
        string img;
        mapping(uint256 => Donor) donors;
    }
    
    struct Donor {
        uint256 donorId;
        uint256 amount;
        string message;
    }

    struct User {
        uint256 fundraisingCount;
        mapping(uint256 => string) fundraisings;
    }

    uint256 private amountoffundraisings;

    //Mappings
    mapping(uint256 => string) private fundRaisingsList;
    mapping(address => User) private userFundraisings;
    mapping(string => FundRaising) private fundraisings;
    mapping(string => bool) private fundraisingExist;

    //Events
    event FundRaisingCreated(string identification, string imgpath);
    event DonationReceived(uint256 indexed donorId, string identification, uint256 amount, string message);
    event FundsRetrieved(address indexed retriever, string identification, uint256 amount);
  
    //Functions
    //Creates a fund raising associate to caster, is open by default.
    function createFundRaising(string memory identification, string memory imgpath) public {
        require(bytes(identification).length > 0, "Identification should not be empty");
        require(fundraisingExist[identification] == false, "There is already a fund raising with that identification");
        
        userFundraisings[msg.sender].fundraisingCount ++;
        uint256 fundraisingCount = userFundraisings[msg.sender].fundraisingCount;
        userFundraisings[msg.sender].fundraisings[fundraisingCount] = identification;

        fundraisings[identification].creator = msg.sender;
        fundraisings[identification].totalAmount = 0;
        fundraisings[identification].amountToRetrieve = 0;
        fundraisings[identification].donorCount = 0;
        fundraisings[identification].isOpen = true;
        fundraisings[identification].img = imgpath;
        fundraisingExist[identification] = true;

        fundRaisingsList[amountoffundraisings] = identification;
        amountoffundraisings++;

        emit FundRaisingCreated(identification,imgpath);
    }

    //Opens the fund raising to enable it to receive donations
    function openFundRaising(string memory identification) public  {
        require(bytes(identification).length > 0, "Identification should not be empty");
        require(msg.sender == fundraisings[identification].creator, "Only the creator can open a fund raising");
        require(!fundraisings[identification].isOpen, "Fund raising already open");
        fundraisings[identification].isOpen = true;
    }

    //Close the fund raising to disable it to receive donations. It can be reopened.
    function closeFundRaising(string memory identification) public  {
        require(bytes(identification).length > 0, "Identification should not be empty");
        require(msg.sender == fundraisings[identification].creator, "Only the creator can close a fund raising");
        require(fundraisings[identification].isOpen, "Fund raising already closed");
        fundraisings[identification].isOpen = false;
    }

    //Donates to the fundraising [identification] an amount set in VALUE. 
    //In [message], a message can be left with the donation.
    function donate(string memory identification, string memory message) public payable {
        require(msg.value > 0, "Donation amount should be greater than zero");
        require(bytes(identification).length > 0, "Identification should not be empty");
        require(fundraisings[identification].isOpen, "Fundraising is closed");

        FundRaising storage fundraising = fundraisings[identification];
        uint256 donorId = fundraising.donorCount + 1;
        fundraising.donors[donorId].donorId = donorId;
        fundraising.donors[donorId].amount = msg.value;
        fundraisings[identification].totalAmount += msg.value;
        fundraisings[identification].amountToRetrieve += msg.value;
        fundraising.donors[donorId].message = message;
        fundraising.donorCount++;

        emit DonationReceived(donorId, identification, msg.value, message);
    }
    
    //Returns the amount of fund raisings stored in the contract.
    function getAmountOfFundRaisings() public view returns (uint256) {
        return (amountoffundraisings);
    }

    //Returns the amount of fund raisings associated to my account.
    function getAmountOfMyFundRaisings() public view returns (uint256) {
        return (userFundraisings[msg.sender].fundraisingCount);
    }

    //From 1 to the amount of fund raisings associated to the account, 
    //returns the name of the fundraise and the amount of funds to retrieve
    function getNameOfMyFundRaise(uint256 fundraiseid) public view returns (string memory, uint256) {
        require(fundraiseid > 0, "Fund raise id should not be empty");
        return (userFundraisings[msg.sender].fundraisings[fundraiseid], fundraisings[userFundraisings[msg.sender].fundraisings[fundraiseid]].amountToRetrieve);
    }

    //From 1 to the amount of all fund raisings, 
    //returns the name of the fundraise and the amount of funds to retrieve
    function getNameOfFundRaise(uint256 fundraiseid) public view returns (string memory) {
        require(fundraiseid > 0, "Fund raise id should not be empty");
        return (fundRaisingsList[fundraiseid]);
    }

    //given the name of any fund raising, it returns the amount of donors, 
    //the total amount of tokens donated and if it's open
    function getFundRaising(string memory identification) public view returns (uint256, uint256, bool) {
        require(bytes(identification).length > 0, "Identification should not be empty");
        FundRaising storage fundraising = fundraisings[identification];
        return (fundraising.totalAmount,fundraising.donorCount,fundraising.isOpen);
    }

    //Given a fund raising and a number of donor, it returns the amount donated and the message left
    function getDonor(string memory identification, uint256 donorId) public view returns (uint256, string memory, uint256) {
        require(bytes(identification).length > 0, "Identification should not be empty");
        
        FundRaising storage fundraising = fundraisings[identification];
        return (fundraising.donors[donorId].donorId, fundraising.donors[donorId].message, fundraising.donors[donorId].amount);
    }
    
    //Given the name of a fundraising (created by the account that queries,
    //it withdraws the pending tokens stored in the contract. Balances are updated
    function withdrawFunds(string memory identification) public {
        require(bytes(identification).length > 0, "Identification should not be empty");
        require(msg.sender == fundraisings[identification].creator, "Only the creator can retrieve funds");
        require(fundraisings[identification].amountToRetrieve > 0 ,"There's no funds to retrieve");

        uint256 amount = fundraisings[identification].amountToRetrieve;

        address payable owner = msg.sender;

        owner.transfer(amount); 
        fundraisings[identification].amountToRetrieve = 0;

        emit FundsRetrieved(msg.sender, identification, amount);

        
    }
    */
}

