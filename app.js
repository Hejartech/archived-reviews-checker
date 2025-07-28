// صبر می‌کنیم تا کل صفحه بارگذاری شود
document.addEventListener('DOMContentLoaded', () => {
    // --- بخش تنظیمات: این مقادیر باید جایگزین شوند ---
    // آدرس قرارداد هوشمندی که توابع addReview و archiveReview را دارد
    const contractAddress = "0x6D3A8Fd5cF89f9a429BFaDFd970968F646AFF325"; // <-- اینجا آدرس قرارداد را بگذارید
    // کلید API از یک سرویس دهنده مثل Infura یا Alchemy
    const apiKey = "74489a24b34d4b71a47f927b2327f8bc"; // <-- اینجا کلید API خود را بگذارید
    // ABI قرارداد
    const contractABI = [{"inputs":[{"internalType":"address","name":"implementation","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"}],"name":"ERC1967InvalidImplementation","type":"error"},{"inputs":[],"name":"ERC1967NonPayable","type":"error"},{"inputs":[],"name":"FailedCall","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"}]; // <-- قدم بعدی توضیح می‌دهد چطور این را پیدا کنید

    // --- پایان بخش تنظیمات ---

    // تعریف ارائه‌دهنده برای اتصال به بلاکچین اتریوم
    const provider = new ethers.providers.InfuraProvider("mainnet", apiKey);
    // ساخت یک نمونه از قرارداد برای تعامل با آن
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // گرفتن عناصر HTML
    const checkButton = document.getElementById('checkButton');
    const addressInput = document.getElementById('addressInput');
    const loader = document.getElementById('loader');
    const resultsList = document.getElementById('archiverList');
    const errorMessage = document.getElementById('errorMessage');

    // افزودن رویداد کلیک به دکمه
    checkButton.addEventListener('click', findArchivers);

    async function findArchivers() {
        // آماده‌سازی UI
        resultsList.innerHTML = '';
        errorMessage.textContent = '';
        loader.style.display = 'block';

        let subjectAddress = addressInput.value.trim();

        // (اختیاری) منطق تبدیل هندل توییتر به آدرس
        if (subjectAddress.startsWith('@')) {
            // این بخش پیچیده است و نیاز به یک سرویس خارجی برای نگاشت توییتر به آدرس دارد
            // فعلا آن را ساده نگه می‌داریم و از کاربر می‌خواهیم آدرس والت را وارد کند
            errorMessage.textContent = 'لطفاً به جای هندل توییتر، آدرس کیف پول خود را وارد کنید. قابلیت توییتر در حال توسعه است.';
            loader.style.display = 'none';
            return;
        }

        if (!ethers.utils.isAddress(subjectAddress)) {
            errorMessage.textContent = 'آدرس وارد شده معتبر نیست.';
            loader.style.display = 'none';
            return;
        }
        
        try {
            // 1. پیدا کردن تمام رویدادهای ReviewArchived
            // این رویدادها شامل ID ریویوهای آرشیو شده هستند
            const archiveFilter = contract.filters.ReviewArchived();
            const archiveEvents = await contract.queryFilter(archiveFilter, 0, 'latest');
            const archivedReviewIds = new Set(archiveEvents.map(event => event.args.reviewId.toString()));
            
            if (archivedReviewIds.size === 0) {
                 resultsList.innerHTML = '<li>هیچ ریویوی آرشیو شده‌ای در کل سیستم یافت نشد.</li>';
                 loader.style.display = 'none';
                 return;
            }

            // 2. پیدا کردن تمام ریویوهایی که برای آدرس مورد نظر ما نوشته شده (subject)
            // از آنجایی که رویداد AddReview شما ایندکس (indexed) برای subject ندارد، باید همه را بگیریم و فیلتر کنیم
            // **نکته مهم:** این کار می‌تواند کند باشد اگر رویدادهای زیادی وجود داشته باشد.
            // روش بهتر: اگر رویداد AddReview هم topic برای subject داشت، می‌توانستیم مستقیم فیلتر کنیم.
            // با توجه به اطلاعاتی که دادید، فرض می‌کنیم رویداد AddReview ایندکس نشده است.
            
            // فرض می‌کنیم رویدادی به نام ReviewAdded وجود دارد
            const addReviewFilter = contract.filters.ReviewAdded(); // <-- نام رویداد را با نام واقعی جایگزین کنید
            const addReviewEvents = await contract.queryFilter(addReviewFilter, 0, 'latest');

            // 3. پیدا کردن نویسندگانی که ریویوی آن‌ها برای ما آرشیو شده است
            const archivers = new Set();
            for (const event of addReviewEvents) {
                const author = event.args.author;
                const subject = event.args.subject;
                const reviewId = event.args.reviewId.toString();

                // اگر ریویو برای شخص مورد نظر ماست و ID آن در لیست آرشیوشده‌ها قرار دارد
                if (subject.toLowerCase() === subjectAddress.toLowerCase() && archivedReviewIds.has(reviewId)) {
                    archivers.add(author);
                }
            }

            // 4. نمایش نتایج
            loader.style.display = 'none';
            if (archivers.size > 0) {
                archivers.forEach(address => {
                    const li = document.createElement('li');
                    li.textContent = address;
                    resultsList.appendChild(li);
                });
            } else {
                resultsList.innerHTML = '<li>هیچ‌کس ریویویی که برای شما نوشته باشد را آرشیو نکرده است.</li>';
            }

        } catch (error) {
            console.error(error);
            errorMessage.textContent = 'خطایی در ارتباط با بلاکچین رخ داد. لطفاً دوباره تلاش کنید.';
            loader.style.display = 'none';
        }
    }
});
