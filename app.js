document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // --- CONFIGURATION FOR BASE CHAIN ---
    // =================================================================

    // The address of the smart contract on the Base chain.
    const contractAddress = "0x6D3A8Fd5cF89f9a429BFaDFd970968F646AFF325";

    // Your API key from a service like Infura or Alchemy.
    const apiKey = "bfe2f8e075df4ad182e97215853407ab";
    
    // The RPC URL for the Base network. We construct this using your API key.
    const baseRpcUrl = `https://base-mainnet.infura.io/v3/bfe2f8e075df4ad182e97215853407ab`;

    // The contract's ABI (this is the same regardless of the chain).
    const contractABI = [[{"inputs":[{"internalType":"address","name":"implementation","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"}],"name":"ERC1967InvalidImplementation","type":"error"},{"inputs":[],"name":"ERC1967NonPayable","type":"error"},{"inputs":[],"name":"FailedCall","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"}]];
    
    // The actual name of the "review added" event from your contract.
    const reviewAddedEventName = "Add Review"; // <-- IMPORTANT: Change if your event name is different!
    
    // The actual name of the "review archived" event.
    const reviewArchivedEventName = "Archive Review"; // <-- IMPORTANT: Change if your event name is different!

    // =================================================================
    // --- END OF CONFIGURATION ---
    // =================================================================

    // Connect to the Base network using its RPC URL
    const provider = new ethers.providers.JsonRpcProvider(baseRpcUrl);
    
    // Create an instance of the contract to interact with
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // --- The rest of the code is identical to the previous version ---

    const checkButton = document.getElementById('checkButton');
    const addressInput = document.getElementById('addressInput');
    const loader = document.getElementById('loader');
    const resultsList = document.getElementById('archiverList');
    const message = document.getElementById('message');

    checkButton.addEventListener('click', findArchivers);

    async function findArchivers() {
        // 1. Prepare the UI
        resultsList.innerHTML = '';
        message.textContent = '';
        loader.style.display = 'block';
        checkButton.disabled = true;

        const subjectAddress = addressInput.value.trim();

        if (!ethers.utils.isAddress(subjectAddress)) {
            message.textContent = 'Please enter a valid Ethereum address (e.g., 0x...).';
            loader.style.display = 'none';
            checkButton.disabled = false;
            return;
        }

        try {
            // 2. Fetch all 'ReviewArchived' events
            const archiveFilter = contract.filters[reviewArchivedEventName]();
            const archiveEvents = await contract.queryFilter(archiveFilter, 0, 'latest');
            const archivedReviewIds = new Set(archiveEvents.map(event => event.args.reviewId.toString()));
            
            if (archivedReviewIds.size === 0) {
                 message.textContent = 'No archived reviews were found in the entire system.';
                 loader.style.display = 'none';
                 checkButton.disabled = false;
                 return;
            }

            // 3. Find all reviews written FOR our user's address
            const addReviewFilter = contract.filters[reviewAddedEventName](null, null, subjectAddress);
            const addReviewEvents = await contract.queryFilter(addReviewFilter, 0, 'latest');

            // 4. Cross-reference the two lists
            const archivers = new Set();
            for (const event of addReviewEvents) {
                const author = event.args.author;
                const reviewId = event.args.reviewId.toString();

                if (archivedReviewIds.has(reviewId)) {
                    archivers.add(author);
                }
            }

            // 5. Display the results
            if (archivers.size > 0) {
                message.textContent = `Found ${archivers.size} user(s) who archived a review about you:`;
                archivers.forEach(address => {
                    const li = document.createElement('li');
                    li.textContent = address;
                    resultsList.appendChild(li);
                });
            } else {
                message.textContent = 'Good news! No one has archived a review that was written about you.';
            }

        } catch (error) {
            console.error("An error occurred:", error);
            message.textContent = 'An error occurred while fetching data from the blockchain. Please check the console for details.';
        } finally {
            loader.style.display = 'none';
            checkButton.disabled = false;
        }
    }
});
