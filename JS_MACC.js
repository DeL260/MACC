class MACCWidget extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });

        this.container = document.createElement("div");
        this.container.style.width = "100%";
        this.container.style.height = "100%";
        this.container.id = "maccPlot";
        this._shadow.appendChild(this.container);

        // ---------------------------------------------
        // BUILT-IN TEST DATA (your Shiny default dataset)
        // ---------------------------------------------
        this.data = [
            { Project_Name:"LED Lighting Retrofit", Status:"Committed", Category:"Energy", Region:"UK", Start_Year:2025, End_Year:2035, Abatement_Annual_tCO2e:850, Capex:180000, Opex_Annual:-45000 },
            { Project_Name:"Solar PV - Site A", Status:"Committed", Category:"Energy", Region:"UK", Start_Year:2025, End_Year:2035, Abatement_Annual_tCO2e:2200, Capex:1500000, Opex_Annual:-120000 },
            { Project_Name:"EV Fleet Phase 1", Status:"Committed", Category:"Fleet", Region:"UK", Start_Year:2025, End_Year:2030, Abatement_Annual_tCO2e:640, Capex:620000, Opex_Annual:80000 },
            { Project_Name:"Heat Pump Programme", Status:"Candidate", Category:"Energy", Region:"UK", Start_Year:2026, End_Year:2035, Abatement_Annual_tCO2e:1100, Capex:980000, Opex_Annual:-30000 },
            { Project_Name:"Process Optimisation", Status:"Candidate", Category:"Process", Region:"EU", Start_Year:2025, End_Year:2030, Abatement_Annual_tCO2e:430, Capex:250000, Opex_Annual:10000 },
            { Project_Name:"Green Tariff Switch", Status:"Committed", Category:"Energy", Region:"UK", Start_Year:2025, End_Year:2030, Abatement_Annual_tCO2e:1800, Capex:5000, Opex_Annual:150000 },
            { Project_Name:"Building Insulation", Status:"Candidate", Category:"Energy", Region:"EU", Start_Year:2026, End_Year:2035, Abatement_Annual_tCO2e:950, Capex:750000, Opex_Annual:-20000 },
            { Project_Name:"EV Fleet Phase 2", Status:"Candidate", Category:"Fleet", Region:"UK", Start_Year:2027, End_Year:2035, Abatement_Annual_tCO2e:1250, Capex:900000, Opex_Annual:95000 },
            { Project_Name:"Biogas Boilers", Status:"Candidate", Category:"Energy", Region:"EU", Start_Year:2026, End_Year:2032, Abatement_Annual_tCO2e:780, Capex:1100000, Opex_Annual:60000 },
            { Project_Name:"Supply Chain Engagement", Status:"Candidate", Category:"Supply Chain", Region:"APAC", Start_Year:2026, End_Year:2030, Abatement_Annual_tCO2e:560, Capex:80000, Opex_Annual:25000 },
            { Project_Name:"Data Centre Cooling", Status:"Committed", Category:"IT", Region:"US", Start_Year:2025, End_Year:2030, Abatement_Annual_tCO2e:320, Capex:420000, Opex_Annual:-80000 },
            { Project_Name:"Renewable PPAs", Status:"Candidate", Category:"Energy", Region:"UK", Start_Year:2026, End_Year:2035, Abatement_Annual_tCO2e:3100, Capex:200000, Opex_Annual:180000 },
            { Project_Name:"Employee Travel Policy", Status:"Candidate", Category:"Travel", Region:"UK", Start_Year:2025, End_Year:2030, Abatement_Annual_tCO2e:210, Capex:15000, Opex_Annual:5000 },
            { Project_Name:"Logistics Routing AI", Status:"Candidate", Category:"Logistics", Region:"EU", Start_Year:2026, End_Year:2030, Abatement_Annual_tCO2e:480, Capex:350000, Opex_Annual:20000 },
            { Project_Name:"Refrigerant Mgmt", Status:"Candidate", Category:"Process", Region:"US", Start_Year:2025, End_Year:2030, Abatement_Annual_tCO2e:190, Capex:90000, Opex_Annual:-15000 },
            { Project_Name:"Embodied Carbon Specs", Status:"Candidate", Category:"Supply Chain", Region:"APAC", Start_Year:2027, End_Year:2035, Abatement_Annual_tCO2e:670, Capex:30000, Opex_Annual:8000 },
            { Project_Name:"Supplier Audits", Status:"Candidate", Category:"Supply Chain", Region:"APAC", Start_Year:2026, End_Year:2030, Abatement_Annual_tCO2e:340, Capex:60000, Opex_Annual:30000 },
            { Project_Name:"Carbon Capture Pilot", Status:"Candidate", Category:"Carbon Removal", Region:"UK", Start_Year:2028, End_Year:2035, Abatement_Annual_tCO2e:1500, Capex:3500000, Opex_Annual:200000 },
            { Project_Name:"Nature-based Offsets", Status:"Candidate", Category:"Carbon Removal", Region:"UK", Start_Year:2026, End_Year:2035, Abatement_Annual_tCO2e:2800, Capex:400000, Opex_Annual:-50000 },
            { Project_Name:"Hydrogen Trials", Status:"Candidate", Category:"Energy", Region:"UK", Start_Year:2028, End_Year:2035, Abatement_Annual_tCO2e:420, Capex:2800000, Opex_Annual:120000 }
        ];

        this.props = {
            carbonPrice: 50,
            abatementTarget: 60000,
            discountRate: 0.07
        };

        this._plotlyLoaded = false;
    }

    async connectedCallback() {
        await this._loadPlotly();
        this._render();
    }

    async _loadPlotly() {
        if (this._plotlyLoaded) return;

        await new Promise(resolve => {
            const script = document.createElement("script");
            script.src = "https://cdn.plot.ly/plotly-2.29.1.min.js";
            script.onload = resolve;
            this._shadow.appendChild(script);
        });

        this._plotlyLoaded = true;
    }

    // ------------------------
    // SAC → widget data input
    // ------------------------
    set dataBindings(binding) {
        if (!binding || !binding.data) return;

        // Override internal test data
        this.data = binding.data.map(r => ({
            Project_Name: r.Project_Name,
            Status: r.Status,
            Category: r.Category,
            Region: r.Region,
            Start_Year: Number(r.Start_Year),
            End_Year: Number(r.End_Year),
            Abatement_Annual_tCO2e: Number(r.Abatement_Annual_tCO2e),
            Capex: Number(r.Capex),
            Opex_Annual: Number(r.Opex_Annual)
        }));

        if (this._plotlyLoaded) this._render();
    }

    set carbonPrice(v) { this.props.carbonPrice = v; }
    set abatementTarget(v) { this.props.abatementTarget = v; }
    set discountRate(v) { this.props.discountRate = v; }

    // -------------------------
    // CALCULATION FUNCTIONS
    // (same as previous version)
    // -------------------------
    calcMetrics(df, targetYear, discountRate) {
        return df.map(r => {
            let end = Math.min(r.End_Year, targetYear);
            let years = Math.max(0, end - r.Start_Year + 1);
            let abate = r.Abatement_Annual_tCO2e * years;

            let rDisc = discountRate;
            let npvOpex = years === 0 ? 0 :
                (rDisc === 0 ? r.Opex_Annual * years :
                    r.Opex_Annual * (1 - Math.pow(1 + rDisc, -years)) / rDisc);

            let totalCost = r.Capex + npvOpex;
            let mac = totalCost / Math.max(abate, 1e-9);

            return { ...r, Years: years, Abate_to_Target: abate, NPV_TotalCost: totalCost, MAC: mac };
        });
    }

    selectGreedy(df) {
        let sorted = df.sort((a,b)=> a.MAC - b.MAC);
        let cost = 0;
        let abate = 0;

        return sorted.map(r => {
            let nextC = cost + r.NPV_TotalCost;
            let nextA = abate + r.Abate_to_Target;

            let selected = nextC <= 999999999;
            if (selected) {
                cost = nextC;
                abate = nextA;
            }

            return { ...r, Selected: selected };
        });
    }

    addGeometry(df) {
        let cum = 0;
        return df.map(r => {
            let start = cum;
            let end = cum + r.Abate_to_Target;
            cum = end;

            return { ...r, CumStart: start, CumEnd: end };
        });
    }

    macColor(vals) {
        let min = Math.min(...vals);
        let max = Math.max(...vals);
        let range = max - min;

        return vals.map(v => {
            if (range === 0) return "rgba(74,222,128,0.85)";
            let t = (v - min) / range;
            t = Math.max(0, Math.min(1,t));

            let R = t < 0.5 ? 74 + (251-74)*(t/0.5) : 251 + (239-251)*((t-0.5)/0.5);
            let G = t < 0.5 ? 222 + (191-222)*(t/0.5) : 191 + (68-191)*((t-0.5)/0.5);
            let B = t < 0.5 ? 128 + (36-128)*(t/0.5) : 36 + (68-36)*((t-0.5)/0.5);

            return `rgba(${Math.round(R)},${Math.round(G)},${Math.round(B)},0.85)`;
        });
    }

    // -------------------------
    // RENDER PLOT
    // -------------------------
    _render() {
        let df = this.calcMetrics(this.data, 2030, this.props.discountRate);
        df = this.selectGreedy(df);
        df = this.addGeometry(df);

        let colours = this.macColor(df.map(d => d.MAC));
        let xMax = Math.max(...df.map(d => d.CumEnd));

        let traces = df.map((r, i) => ({
            x: [r.CumStart, r.CumEnd, r.CumEnd, r.CumStart, r.CumStart],
            y: [0, 0, r.MAC, r.MAC, 0],
            type: "scatter",
            mode: "lines",
            fill: "toself",
            fillcolor: colours[i],
            hoverinfo: "text",
            text: `${r.Project_Name}<br>MAC: £${r.MAC.toFixed(2)}`,
            line: {
                color: r.Status === "Committed"
                    ? "rgba(15,23,42,0.9)"
                    : "rgba(15,23,42,0.3)",
                width: r.Status === "Committed" ? 2 : 1
            },
            showlegend: false
        }));

        Plotly.newPlot(this.container, traces, {
            hovermode: "closest",
            xaxis: { title: "Cumulative Abatement (tCO2e)" },
            yaxis: { title: "MAC (£/tCO2e)" },
            paper_bgcolor: "white",
            plot_bgcolor: "#f8fafc"
        });
    }
}

customElements.define("macc-widget", MACCWidget);
