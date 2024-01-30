<script>
    import ids from "$data/ids.csv";
    import HeatmapRow from "$components/Heatmap.Row.svelte";
    import copy from "$data/copy.json";

    let current = 0;
</script>

<section class="heatmap">
    <div class="top-row">
        {#each copy.phrases as phrase, i} 
            <p class="top-row-phrase top-row-phrase-{i}"
                class:active={current === i}>
                {phrase.lyrics}</p>
        {/each}
    </div>
    <div class="performer-rows">
        {#each ids as performance}
            {#if performance.id !== "standard"}
                <HeatmapRow data={performance} />
            {/if}
        {/each}
    </div>
</section>

<style>
    .heatmap {
        width: 100%;
    }
    .top-row {
        padding: 0.5rem 1rem 0.5rem 21rem;
        width: 100%;
        display: flex;
        flex-direction: row;
        position: sticky;
        top: 0;
        background: var(--color-navy-dark);
        border-bottom: 2px solid var(--color-paper);
        z-index: 1000;
    }
    .top-row-phrase {
        width: 6.25%;
        text-overflow: ellipsis;
        margin: 0.125rem;
        height: 2rem;
        font-size: var(--14px);
        font-family: var(--sans);
        overflow: hidden;
        white-space: nowrap;
        transition: width 1s;
    }
    .active {
        width: 30%;
        font-weight: 700;
    }
</style>