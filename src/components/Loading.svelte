<script>
    export let pos;
</script>

<div class="loader" class:abpos={pos}>
    <div class="dot-pulse"></div>
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
        left: -9999px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: var(--color-grey-blue);
        color: var(--color-grey-blue);
        box-shadow: 9999px 0 0 -5px;
        animation: dot-pulse 1.5s infinite linear;
        animation-delay: 0.25s;
        margin-left: 1rem;
        transition: all calc(var(--1s) * 0.25) ease-in-out;
    }
    .dot-pulse::before, .dot-pulse::after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: var(--color-grey-blue);
        color: var(--color-grey-blue);
    }
    .dot-pulse::before {
        box-shadow: 9984px 0 0 -5px;
        animation: dot-pulse-before 1.5s infinite linear;
        animation-delay: 0s;
    }
    .dot-pulse::after {
        box-shadow: 10014px 0 0 -5px;
        animation: dot-pulse-after 1.5s infinite linear;
        animation-delay: 0.5s;
    }

    @keyframes dot-pulse-before {
        0% {
            box-shadow: 9984px 0 0 -5px;
        }
        30% {
            box-shadow: 9984px 0 0 2px;
        }
        60%, 100% {
            box-shadow: 9984px 0 0 -5px;
        }
    }
    @keyframes dot-pulse {
        0% {
            box-shadow: 9999px 0 0 -5px;
        }
        30% {
            box-shadow: 9999px 0 0 2px;
        }
        60%, 100% {
            box-shadow: 9999px 0 0 -5px;
        }
    }
    @keyframes dot-pulse-after {
        0% {
            box-shadow: 10014px 0 0 -5px;
        }
        30% {
            box-shadow: 10014px 0 0 2px;
        }
        60%, 100% {
            box-shadow: 10014px 0 0 -5px;
        }
    }
</style>