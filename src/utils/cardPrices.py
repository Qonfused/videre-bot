import re, requests, json
import numpy as np
import pandas as pd

from functools import reduce

import matplotlib.pyplot as plt
import seaborn as sns

import sys, io, base64
from tabulate import tabulate

# Generate and return card price history
def getPriceHistory(cardname, match = "fuzzy", time_interval = 7):

    if match == "fuzzy":
        # Get fuzzy matched name and uri from Scryfall
        autocompleteAPI = requests.get(f"https://api.scryfall.com/cards/named?fuzzy={ cardname }")

        matchedName = autocompleteAPI.json()["name"].replace("/", "%2F")

        purchase_uris = autocompleteAPI.json()["purchase_uris"]
    else:
        matchedName = cardname.replace("/", "%2F")

    # Get MTGStocks ID/URI and matched cardname
    mtgstocksAPI = requests.get(f"https://api.mtgstocks.com/search/autocomplete/{ matchedName }")
    id, name, slug = mtgstocksAPI.json()[0].values()

    # Get full historical pricing data
    pricesAPI = requests.get(f"https://api.mtgstocks.com/prints/{ id }/prices")

    # Extract prices by category
    low = pd.DataFrame(pricesAPI.json()["low"], columns = ["Date", "Low"])
    average = pd.DataFrame(pricesAPI.json()["avg"], columns = ["Date", "Average"])
    high = pd.DataFrame(pricesAPI.json()["high"], columns = ["Date", "High"])
    foil = pd.DataFrame(pricesAPI.json()["foil"], columns = ["Date", 'Foil'])
    market = pd.DataFrame(pricesAPI.json()["market"], columns = ["Date", "Market"])
    market_foil = pd.DataFrame(pricesAPI.json()["market_foil"], columns = ["Date", "Market Foil"])

    # Merge columns and format epoch as date index
    combined_prices = reduce(
        lambda x,y: pd.merge(x,y, on = "Date", how = "outer"),
        [low, average, market, high, foil, market_foil]
    )
    combined_prices["Date"] = pd.to_datetime(combined_prices["Date"], unit = "ms")
    combined_prices["Date"] = combined_prices["Date"].apply(lambda x: x.strftime("%Y-%m-%d"))

    combined_prices = combined_prices.tail(time_interval).set_index("Date")

    # Generate line plot for timeseries
    def render_fig_table(data, columns, xlabel, ylabel, title, fig_width = 11, fig_height = 4):
        sns.set(rc = { "figure.figsize" : (fig_width, fig_height) })

        fig, ax = plt.subplots()
        for cols in columns:
            # Format category names with latest price for chart legend
            category_name = cols
            if (data[cols].iloc[-1] + data[cols].iloc[-2] > -1):
                category_name += " (${:,.2f})".format(data[cols].iloc[-1])

            ax.plot(data[cols], label = category_name.replace(" ($nan)", ""))
            ax.legend()
            ax.set_xlabel(xlabel)
            ax.set_ylabel(ylabel)
            #ax.set_title(title)

        # Write plot to bytes buffer
        buffer = io.BytesIO()

        plt.savefig(buffer, format = "png")
        plt.close()

        return base64.b64encode(buffer.getvalue()).decode("utf-8").replace("\n", "")

    # Call plotting function
    plt_IObytes = render_fig_table(
        combined_prices,
        combined_prices.columns,
        xlabel = "Dates", ylabel = "TCGplayer Price (USD $)",
        title = f"Price History for { name }",
        fig_width = 11, fig_height = 4,
    )

    # Format currency for table output
    for col in combined_prices.columns:
        combined_prices[col] = combined_prices[col].map("${:,.2f}".format).replace("$nan", "-")

    # Format json output
    data = {}

    if match == "fuzzy":
        data["matchedName"] = matchedName
        data["urls"] = {
            "Cardhoarder" : purchase_uris["cardhoarder"],
            "Cardmarket" : purchase_uris["cardmarket"],
            "TCGPlayer" : purchase_uris["tcgplayer"],
            "MTGStocks": f"https://www.mtgstocks.com/prints/{ slug }"
        }

        data["prices"] = autocompleteAPI.json()["prices"]
        data["set"] = autocompleteAPI.json()["set"]
        data["set_name"] = autocompleteAPI.json()["set_name"]
        data["png"] = autocompleteAPI.json()['image_uris']["png"]
        data["mana_cost"] = autocompleteAPI.json()['mana_cost']
    else:
        data["urls"] = { 'MTGStocks': f"https://www.mtgstocks.com/prints/{ slug }" }

    data["graph"] = plt_IObytes
    data["data"] = combined_prices.reset_index().to_dict(orient = "list")
    data["table"] = tabulate(
        combined_prices,
        tablefmt = "rst",
        headers = ["Date", "Low", "Average", "Market", "High", "Foil", "Market Foil"]
    )

    return json.dumps(data)

# Helper function for templatizing arguments array
def get_args(message, command):
    self = re.compile(" --(.*?) ").split(message[len(command):])
    for i in range(len(self)):
        self[i:i+1] = re.compile(" -").split(self[i])
    for i in range(len(self)-1):
        self[i+1] = re.sub(r"-", "", self[i+1])
    return self

# Helper function for setting flags via argv
def get_argv(arg, default = None):
    if len(sys.argv) > 1:
        self = self = get_args(" ".join(sys.argv), str(sys.argv[0]))
        if arg in self:
            pos = self.index(arg)
            self.remove(arg)
            return self[pos]
    return default

# argv parameters
CARDNAME = get_argv("cardname")

print(getPriceHistory(CARDNAME))
sys.stdout.flush()
