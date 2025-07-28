const provider = new ethers.providers.JsonRpcProvider("https://base.llamarpc.com");

const CONTRACT_ADDRESS = "0x6d3a8fd5cf89f9a429bfadfd970968f646aff325";
const ABI = [
  "event ReviewArchived(uint256 indexed reviewId, address indexed author, address indexed subject)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

async function checkArchives() {
  const subject = document.getElementById("addressInput").value.trim().toLowerCase();
  if (!ethers.utils.isAddress(subject)) {
    alert("Please enter a valid wallet address.");
    return;
  }

  const filter = contract.filters.ReviewArchived(null, null, subject);
  const logs = await contract.queryFilter(filter, 0, "latest");

  const authors = [...new Set(logs.map(log => log.args.author))];

  const resultsDiv = document.getElementById("results");
  if (authors.length === 0) {
    resultsDiv.innerHTML = `<p>No archived reviews found for this address.</p>`;
  } else {
    resultsDiv.innerHTML = `<h3>These addresses archived reviews written about you:</h3>
      <ul>${authors.map(addr => `<li>${addr}</li>`).join("")}</ul>`;
  }
}
