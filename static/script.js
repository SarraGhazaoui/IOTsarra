document.addEventListener("DOMContentLoaded", function () {
    // Store historical data for plotting trends (for demonstration purposes)
    let temperatureData = [];
    let humidityData = [];
    let energyData = [];
    let timeLabels = []; // To represent time on x-axis

    let temperatureTrendChart;
    let humidityTrendChart;
    let energyTrendChart;

    // Function to fetch real-time data
    function fetchData() {
        fetch('/get_latest_data')
            .then(response => response.json())
            .then(data => {
                const temperature = data.temperature;
                const humidity = data.humidity;
                const energyConsumption = data.energy_consumption;

                // Update the temperature, humidity, and energy consumption in the UI
                document.getElementById("temperatureValue").textContent = `${temperature} °C`;
                document.getElementById("humidityValue").textContent = `${humidity} %`;
                document.getElementById("humidityBar").style.width = `${humidity}%`;
                document.getElementById("energyvalue").textContent = `${energyConsumption} KW`;

                // Add the new data to the historical data arrays
                temperatureData.push(temperature);
                humidityData.push(humidity);
                energyData.push(energyConsumption);
                
                // Add a timestamp (or simply incrementing time) for x-axis labels
                timeLabels.push(new Date().toLocaleTimeString());

                // Keep data arrays to a reasonable length (e.g., show last 10 values)
                if (temperatureData.length > 10) {
                    temperatureData.shift();
                    humidityData.shift();
                    energyData.shift();
                    timeLabels.shift(); // Remove the oldest time label as well
                }

                // Update or create Temperature Trend Chart
                const tempCtx = document.getElementById("temperatureTrendChart").getContext("2d");
                if (!temperatureTrendChart) {
                    temperatureTrendChart = new Chart(tempCtx, {
                        type: "line",
                        data: {
                            labels: timeLabels, // Time labels on x-axis
                            datasets: [{
                                label: "Temperature (°C)",
                                data: temperatureData,
                                borderColor: "#ff5733",
                                backgroundColor: "rgba(255, 87, 51, 0.2)",
                                fill: true,
                                tension: 0.4,
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: false,
                                    title: {
                                        display: true,
                                        text: 'Temperature (°C)'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time'
                                    }
                                }
                            }
                        }
                    });
                } else {
                    // Update existing chart with new data
                    temperatureTrendChart.data.labels = timeLabels;
                    temperatureTrendChart.data.datasets[0].data = temperatureData;
                    temperatureTrendChart.update();
                }

                // Update or create Humidity Trend Chart
                const humidityCtx = document.getElementById("humidityTrendChart").getContext("2d");
                if (!humidityTrendChart) {
                    humidityTrendChart = new Chart(humidityCtx, {
                        type: "line",
                        data: {
                            labels: timeLabels,
                            datasets: [{
                                label: "Humidity (%)",
                                data: humidityData,
                                borderColor: "#00bfff",
                                backgroundColor: "rgba(0, 191, 255, 0.2)",
                                fill: true,
                                tension: 0.4,
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: false,
                                    title: {
                                        display: true,
                                        text: 'Humidity (%)'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time'
                                    }
                                }
                            }
                        }
                    });
                } else {
                    // Update existing chart with new data
                    humidityTrendChart.data.labels = timeLabels;
                    humidityTrendChart.data.datasets[0].data = humidityData;
                    humidityTrendChart.update();
                }

                // Update or create Energy Consumption Trend Chart
                const energyCtx = document.getElementById("energyTrendChart").getContext("2d");
                if (!energyTrendChart) {
                    energyTrendChart = new Chart(energyCtx, {
                        type: "line",
                        data: {
                            labels: timeLabels,
                            datasets: [{
                                label: "Energy Consumption (kW)",
                                data: energyData,
                                borderColor: "#4caf50",
                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                                fill: true,
                                tension: 0.4,
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: false,
                                    title: {
                                        display: true,
                                        text: 'Energy Consumption (kW)'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time'
                                    }
                                }
                            }
                        }
                    });
                } else {
                    // Update existing chart with new data
                    energyTrendChart.data.labels = timeLabels;
                    energyTrendChart.data.datasets[0].data = energyData;
                    energyTrendChart.update();
                }
            });
    }

    // Fetch data every 15 seconds
    setInterval(fetchData, 15000);
});