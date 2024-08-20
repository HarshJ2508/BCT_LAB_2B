const mySecret = 'enter_your_api_key'; // etherscan.io 

const weiToEth = (wei) => {
    return wei / 1e18; 
};

const weiToGwei = (wei) => {
    return wei / 1e9; 
};

const getTopTxns = async (pubKey) => {
    try {        
        const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${pubKey}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${mySecret}`;

        const res = await fetch(apiUrl);
        const result = await res.json();

        
        if (result.status === '1' && result.result.length > 0) {
            const transactions = result.result;

            const timestamps = transactions.map(tx => new Date(tx.timeStamp * 1000).toLocaleTimeString());
            const values = transactions.map(tx => weiToEth(tx.value));
            const gasPrices = transactions.map(tx => weiToGwei(tx.gasPrice));

        
            transactions.forEach(tx => {
                console.log(`Transaction Hash: ${tx.hash}`);
                console.log(`From: ${tx.from}`);
                console.log(`To: ${tx.to}`);
                console.log(`Value: ${weiToEth(tx.value)} ETH`);
                console.log(`Date: ${new Date(tx.timeStamp * 1000).toLocaleString()}`);
                console.log(`Block Number: ${tx.blockNumber}`);
                console.log(`Gas Price: ${weiToGwei(tx.gasPrice)} Gwei`);
                console.log('------------------------------------');
            });

            
            const ctx1 = document.getElementById('txnValueChart').getContext('2d');
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [{
                        label: 'Transaction Value (Ether)',
                        data: values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Value: ${context.raw} ETH`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            },
                            ticks: {
                                maxRotation: 90,
                                minRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value (ETH)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            
            const ctx2 = document.getElementById('gasPriceChart').getContext('2d');
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [{
                        label: 'Gas Price (Gwei)',
                        data: gasPrices,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Gas Price: ${context.raw} Gwei`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            },
                            ticks: {
                                maxRotation: 90,
                                minRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Gas Price (Gwei)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

        } else {
            console.log('No transactions found or error:', result.message);
        }
    } catch (err) {
        console.log('Fetch error:', err);
    }
};

const pubKey = "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5";
getTopTxns(pubKey);
