<script>
    export let pos;
    export let display;
</script>

<div class="loader" class:abpos={pos} style="display:{display}">
    <div class="dots-wrapper">
        <div class="dot-pulse dot1"></div>
        <div class="dot-pulse dot2"></div>
        <div class="dot-pulse dot3"></div>
    </div>
    <p>Loading</p>
</div>

<style>
    .loader {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 5rem;
    }
    .loader.abpos {
        position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
    }
    .dots-wrapper {
        display: flex;
        flex-direction: row;
    }
    p {
        font-family: var(--sans);
        color: var(--color-grey-blue);
        font-weight: 700;
        font-size: var(--12px);
        text-transform: uppercase;
        padding: 0;
        margin: 1rem 0 0 0;
    }
    .dot-pulse {
        position: relative;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: var(--color-grey-blue);
        color: var(--color-grey-blue);
        transition: all calc(var(--1s) * 0.25) ease-in-out;
        margin-right: 0.5rem;
    }
    .dot-pulse.dot1 {
        animation: dot-pulse-before 1.5s infinite linear;
        animation-delay: 0s;
    }
    .dot-pulse.dot2 {
        animation: dot-pulse 1.5s infinite linear;
        animation-delay: 0.25s;
    }
    .dot-pulse.dot3 {
        animation: dot-pulse-after 1.5s infinite linear;
        animation-delay: 0.5s;
    }

    @keyframes dot-pulse-before {
        0% {
            transform: scale(0);
        }
        30% {
            transform: scale(1);
        }
        60%, 100% {
            transform: scale(0);
        }
    }
    @keyframes dot-pulse {
        0% {
            transform: scale(0);
        }
        30% {
            transform: scale(1);
        }
        60%, 100% {
            transform: scale(0);
        }
    }
    @keyframes dot-pulse-after {
        0% {
            transform: scale(0);
        }
        30% {
            transform: scale(1);
        }
        60%, 100% {
            transform: scale(0);
        }
    }
</style>