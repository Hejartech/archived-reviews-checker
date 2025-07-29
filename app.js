document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // --- CONFIGURATION FOR BASE CHAIN ---
    // =================================================================

    // The address of the smart contract on the Base chain.
    const contractAddress = "0x6d3a8fd5cf89f9a429bfadfd970968f646aff325";

    // Your API key from a service like Infura or Alchemy.
    const apiKey = "bfe2f8e075df4ad182e97215853407ab"; // <--- FIX THIS LINE

    // The RPC URL for the Base network, constructed using your API key.
    const baseRpcUrl = `https://base.llamarpc.com`;

    // The contract's ABI for contract 0x6d3a8fd5cf89f9a429bfadfd970968f646aff325
    const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"subject","type":"address"}],"name":"ErrAlreadyExists","type":"error"},{"inputs":[],"name":"ErrUnexistingReview","type":"error"},{"inputs":[],"name":"ErrUnsorted","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"reviewId","type":"uint256"},{"indexed":true,"internalType":"address","name":"author","type":"address"},{"indexed":true,"internalType":"address","name":"subject","type":"address"}],"name":"ReviewArchived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"score","type":"uint8"},{"indexed":true,"internalType":"address","name":"author","type":"address"},{"indexed":true,"internalType":"address","name":"subject","type":"address"},{"indexed":false,"internalType":"address","name":"paymentToken","type":"address"},{"indexed":false,"internalType":"string","name":"comment","type":"string"},{"indexed":false,"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"indexed":false,"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"},{"indexed":true,"internalType":"uint256","name":"reviewId","type":"uint256"}],"name":"ReviewCreated","type":"event"},{"inputs":[{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"address","name":"subject","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"string","name":"comment","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"}],"name":"addReview","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"reviewId","type":"uint256"}],"name":"archiveReview","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"reviewId","type":"uint256"}],"name":"getReview","outputs":[{"components":[{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"address","name":"author","type":"address"},{"internalType":"address","name":"subject","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"string","name":"comment","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"}],"internalType":"struct Review","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"author","type":"address"},{"internalType":"uint256","name":"from","type":"uint256"},{"internalType":"uint256","name":"to","type":"uint256"}],"name":"getReviewsByAuthor","outputs":[{"components":[{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"address","name":"author","type":"address"},{"internalType":"address","name":"subject","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"string","name":"comment","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"}],"internalType":"struct Review[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"subject","type":"address"},{"internalType":"uint256","name":"from","type":"uint256"},{"internalType":"uint256","name":"to","type":"uint256"}],"name":"getReviewsBySubject","outputs":[{"components":[{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"address","name":"author","type":"address"},{"internalType":"address","name":"subject","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"string","name":"comment","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"}],"internalType":"struct Review[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reviewCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"reviewsByAuthor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"reviewsBySubject","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

    // The correct names of the events, taken from the ABI above.
    const reviewAddedEventName = "ReviewCreated";
    const reviewArchivedEventName = "ReviewArchived";

    // =================================================================
    // --- END OF CONFIGURATION ---
    // =================================================================

    // Connect to the Base network using its RPC URL.
    const provider = new ethers.providers.JsonRpcProvider(baseRpcUrl);

    // Create an instance of the contract to interact with it.
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Get the HTML elements from the page.
    const checkButton = document.getElementById('checkButton');
    const addressInput = document.getElementById('addressInput');
    const loader = document.getElementById('loader');
    const resultsList = document.getElementById('archiverList');
    const message = document.getElementById('message');

    // Add a click event listener to the button.
    checkButton.addEventListener('click', findArchivers);

    async function findArchivers() {
        // Prepare the UI for a new search.
        resultsList.innerHTML = '';
        message.textContent = '';
        loader.style.display = 'block';
        checkButton.disabled = true;

        const subjectAddress = addressInput.value.trim();

        // Validate the entered address.
        if (!ethers.utils.isAddress(subjectAddress)) {
            message.textContent = 'Please enter a valid Ethereum address (e.g., 0x...).';
            loader.style.display = 'none';
            checkButton.disabled = false;
            return;
        }

        try {
            // Fetch all 'ReviewArchived' events to find which reviews are archived.
            const archiveFilter = contract.filters[reviewArchivedEventName]();
            const archiveEvents = await contract.queryFilter(archiveFilter, 0, 'latest');
            const archivedReviewIds = new Set(archiveEvents.map(event => event.args.reviewId.toString()));

            if (archivedReviewIds.size === 0) {
                 message.textContent = 'No archived reviews were found in the entire system.';
                 loader.style.display = 'none';
                 checkButton.disabled = false;
                 return;
            }

            // Find all reviews written FOR our user's address.
            const addReviewFilter = contract.filters[reviewAddedEventName](null, null, subjectAddress);
            const addReviewEvents = await contract.queryFilter(addReviewFilter, 0, 'latest');

            // Cross-reference the two lists to find the archivers.
            const archivers = new Set();
            for (const event of addReviewEvents) {
                const author = event.args.author;
                const reviewId = event.args.reviewId.toString();

                if (archivedReviewIds.has(reviewId)) {
                    archivers.add(author);
                }
            }

            // Display the results.
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
            // Re-enable the button and hide the loader.
            loader.style.display = 'none';
            checkButton.disabled = false;
        }
    }
});
