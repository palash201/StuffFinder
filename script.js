function toggleClass(elementId, className, state) {
    let x = document.getElementById(elementId);
    x.classList.toggle(className, state)
}

function toggleDisplay(elementId, state) {
    toggleClass(elementId, "hidden", state)
}

function toggleVisibility(elementId, state) {
    toggleClass(elementId, "invisible", state)
}

function update(elementId, newValue) {
    document.getElementById(elementId).innerHTML = newValue;
}

let data = {
    stuff: 0,
    lookReq: 10,
    looksDone: 0,
    canLook: true,
    canUpgrade: false,
    isGolden: false,
    harvestsDone: 0,
    pilesHarvested: 0,
    autoLookLevel: 0,
    autoLookCost: 1,
    autoLookEffect: 0,
    goldStuffLevel: 0,
    goldStuffCost: 10,
    goldStuffEffect: 0,
    doubleStuffLevel: 0,
    doubleStuffCost: 100,
    doubleStuffEffect: 1,
    autoHarvestLevel: 0,
    autoHarvestCost: 5,
    autoHarvestEffect: 0,
};

let bindings = [
    "stuff",
    "lookReq",
    "looksDone",
    "autoLookLevel",
    "autoLookEffect",
    "autoLookCost",
    "goldStuffLevel",
    "goldStuffEffect",
    "goldStuffCost",
    "doubleStuffLevel",
    "doubleStuffCost",
    "doubleStuffEffect",
    "autoHarvestLevel",
    "autoHarvestCost",
    "autoHarvestEffect",
];

let tick = 0;

function gameTick() {
    tick++;
    look(data.autoLookEffect * 50 / 1000);
    harvest(data.autoHarvestEffect * 50 / 1000);
    updateAll();
}

function updateAll() {
    for (let id of bindings) {
        update(id, Math.floor(data[id]));
    }
    toggleClass("stuffPile", "gold", data.isGolden);
    toggleClass("foundMessage", "gold", data.isGolden);
    update("foundMessage", data.isGolden ? "You found a pile of gold stuff!" : "You found a pile of stuff.");
    toggleVisibility("upgrading", !data.canUpgrade);
    toggleDisplay("searchingMessage", !data.canLook);
    toggleDisplay("foundMessage", data.canLook);
    toggleDisplay("look", !data.canLook);
    toggleDisplay("harvest", data.canLook);
    toggleVisibility("looking", !data.canLook);
    toggleVisibility("harvesting", data.canLook);
}

setInterval(gameTick, 50);

function look(times) {
    if (data.canLook) {
        data.looksDone = Math.min(data.looksDone + times, data.lookReq);
        if (data.looksDone === data.lookReq) {
            data.canLook = false;
            data.looksDone = 0;
            if (Math.floor(Math.random() * 100) + 1 < data.goldStuffEffect) {
                data.isGolden = true;
            }
        }
        updateAll();
    }
}

function harvest(times) {
    if (!data.canLook) {
        data.harvestsDone = Math.min(data.harvestsDone + times, 3);
        data.stuff += (Math.floor(Math.random() * 4) + 3) * (data.isGolden ? 10 : 1) * data.doubleStuffEffect * times;
        if (data.harvestsDone >= 1) {
            toggleVisibility("top", true);
        }
        if (data.harvestsDone >= 2) {
            toggleVisibility("mid", true);
        }
        if (data.harvestsDone >= 3) {
            toggleVisibility("top", false);
            toggleVisibility("mid", false);
            data.harvestsDone = 0;
            data.pilesHarvested++;
            data.canLook = true;
            if (data.pilesHarvested === 1) {
                data.canUpgrade = true;
            }
            data.isGolden = false;
        }
        updateAll();
    }

}

function buy(upgradeName) {
    switch (upgradeName) {
        case "autoLook":
            if (data.stuff >= data.autoLookCost) {
                data.stuff -= data.autoLookCost;
                data.autoLookLevel++;
                data.autoLookEffect++;
                data.autoLookCost = Math.pow(data.autoLookLevel + 1, 2);
            }
            break;
        case "autoHarvest":
            if (data.stuff >= data.autoHarvestCost) {
                data.stuff -= data.autoHarvestCost;
                data.autoHarvestLevel++;
                data.autoHarvestEffect++;
                data.autoHarvestCost = 5 * Math.pow(data.autoHarvestLevel + 1, 4);
            }
            break;
        case "goldStuff":
            if (data.stuff >= data.goldStuffCost) {
                data.stuff -= data.goldStuffCost;
                data.goldStuffLevel++;
                data.goldStuffEffect += 5;
                data.goldStuffCost = 10 * Math.pow(2, data.goldStuffLevel);
            }
            break;
        case "doubleStuff":
            if (data.stuff >= data.doubleStuffCost) {
                data.stuff -= data.doubleStuffCost;
                data.doubleStuffLevel++;
                data.doubleStuffEffect *= 2;
                data.doubleStuffCost = 100 * Math.pow(5, data.doubleStuffLevel);
            }
            break;
    }
}