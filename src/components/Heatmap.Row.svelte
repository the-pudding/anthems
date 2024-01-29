<script>
    import Icon from "$components/helpers/Icon.svelte";
    import {range} from "d3-array";
    import {select, selectAll} from "d3-selection";
    export let data;

    let current = 0;

    function capitalizeEachWord(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function phraseClick() {
        current = +this.classList[1].split("-")[2];

        let allPhrases = selectAll (".phrase-box");
        let samePhrases = selectAll(`.phrase-box-${current}`);
        let allPhrasesHeader = selectAll (".top-row-phrase");
        let samePhrasesHeader = selectAll(`.top-row-phrase-${current}`);
        
        allPhrases.classed("active", false);
        samePhrases.classed("active", true);
        allPhrasesHeader.classed("active", false);
        samePhrasesHeader.classed("active", true);
    }
    
    let phraseCount = range(1,17);
    let performerName = capitalizeEachWord(data.id.split("_")[0].replace(/-/g, " "));
    let event = capitalizeEachWord(data.id.split("_")[1].replace(/-/g, " "));
    let year = data.id.split("_")[2];
</script>

<div class="heatmap-row">
    <div class="details-wrapper">
        <button class="play-btn">
            <Icon name={"play"} fill={"#02273D"} stroke={"transparent"} strokeWidth={0}/>
        </button>
        <div class="details">
            <p class="name">{performerName}</p>
            <p class="event"><strong>{year}</strong> {event}</p>
        </div>
    </div>
    <div class="box-wrapper">
        {#each phraseCount as phrase, i}
            {@const phraseIndex = `phrase${[i]}_diva`}
            <div class="phrase-box phrase-box-{i}" 
                class:active={current === i}
                style="background: rgba(124, 164, 174, {data[phraseIndex]/1000})"
                on:click={phraseClick}>
                <p>{data[phraseIndex]}</p>
            </div>
        {/each}
    </div>

</div>

<style>
    .heatmap-row {
        width: 100%;
        border-top: 1px solid var(--color-paper);
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
    }
    .heatmap-row:first-of-type {
        border-top: none;
    }
    .details-wrapper {
        width: 20rem;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .play-btn {
        background: var(--color-paper);
        height: 2rem;
        width: 2rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center; 
        margin: 0 0.5rem 0 0;
    }
    .name, .event {
        color: var(--color-paper);
        margin: 0;
        padding: 0;
        font-size: var(--14px);
    }
    .name {
        font-family: Newsagent;
        font-size: var(--28px);
    }
    .event {
        font-family: var(--sans);
    }
    .box-wrapper {
        width: calc(100% - 20rem);
        display: flex;
        flex-direction: row;
    }
    .phrase-box {
        background: var(--color-light-blue);
        width: 6.25%;
        margin: 0.125rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: width 1s;
    }
    .active {
        width: 30%;
        outline: 2px solid var(--color-bright-red);
    }
    .phrase-box p {
        font-family: var(--sans);
        overflow: hidden;
        white-space: nowrap;
        font-size: var(--14px);
        display: none;
    }
</style>