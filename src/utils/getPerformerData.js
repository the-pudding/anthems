import _ from "lodash";
import ids from "$data/ids.csv";

const getPerformerData = (id) => {
	const row = ids.find((row) => row.id === id);
	const performer = _.startCase(id.split("_")[0].replace(/-/g, " "))
		.replace("Beyonce", "Beyoncé")
		.replace("Neyo", "Ne-Yo")
		.replace("Tpain", "T-Pain")
		.replace("Connick Jr", "Connick Jr.")
		.replace("Renee Fleming", "Renée Fleming")
		.replace("Mary J Blige", "Mary J. Blige")
		.replace("Her", "H.E.R.")
		.replace("Leann Rimes", "LeAnn Rimes")
		.replace("Brian Mcknight", "Brian McKnight");
	const event = _.startCase(id.split("_")[1].replace(/-/g, " "))
		.replace("Nba", "NBA")
		.replace("Wnba", "WNBA")
		.replace("Allstar", "All-Star")
		.replace("Mlb", "MLB")
		.replace("Ncaa", "NCAA")
		.replace("Dnc", "DNC")
		.replace("Rnc", "RNC")
		.replace("Nfl", "NFL");
	const year = +id.split("_")[2];
	const genre = _.startCase(row.artistGenre).replace("Rnb", "R&B");
	const key = row.key;
	const stepsFromC = +row.steps_from_C;
	const divaScore = +row["overall_diva"];
	return { performer, event, year, genre, key, stepsFromC, divaScore };
};

export default getPerformerData;
