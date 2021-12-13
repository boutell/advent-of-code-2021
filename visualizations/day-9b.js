var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import input from './day-9-data.js';
;
;
visualize();
function visualize() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.querySelector('#map');
        const ctx = canvas.getContext('2d');
        const map = input.map(line => line.split('').map(v => ({
            height: parseInt(v, 0),
            basin: 0
        })));
        canvas.setAttribute('height', (map[0].length / 100 * map.length).toString());
        let next = 1;
        renderHeights();
        yield delay(1000);
        comparePeers((x, y, value, peers) => {
            if (!peers.find(peer => peer.height <= value.height)) {
                map[y][x].basin = next++;
            }
        });
        yield delay(100);
        renderBasins();
        let changed = false;
        do {
            changed = false;
            comparePeers((x, y, value, peers) => {
                if (value.basin) {
                    return;
                }
                if (value.height === 9) {
                    return;
                }
                const basinPeer = peers.find(peer => peer.basin && (peer.height <= value.height));
                if (basinPeer) {
                    map[y][x].basin = basinPeer.basin;
                    changed = true;
                }
            });
            yield delay(100);
            renderBasins();
        } while (changed);
        console.log(next);
        let basinSizes = [];
        for (let i = 1; (i < next); i++) {
            basinSizes[i] = 0;
        }
        for (let y = 0; (y < map.length); y++) {
            for (let x = 0; (x < map[y].length); x++) {
                const basin = map[y][x].basin;
                basinSizes[basin]++;
            }
        }
        basinSizes = basinSizes.slice(1);
        basinSizes.sort((a, b) => b - a);
        console.log(basinSizes[0] * basinSizes[1] * basinSizes[2]);
        function comparePeers(fn) {
            for (let y = 0; (y < map.length); y++) {
                for (let x = 0; (x < map[y].length); x++) {
                    const peers = [];
                    if (y > 0) {
                        peers.push(map[y - 1][x]);
                    }
                    if (x > 0) {
                        peers.push(map[y][x - 1]);
                    }
                    if (y < (map.length - 1)) {
                        peers.push(map[y + 1][x]);
                    }
                    if (x < (map[y].length - 1)) {
                        peers.push(map[y][x + 1]);
                    }
                    fn(x, y, map[y][x], peers);
                }
            }
        }
        function render(fn) {
            for (let y = 0; (y < map.length); y++) {
                for (let x = 0; (x < map[0].length); x++) {
                    const pixel = fn(map[y][x]);
                    ctx.fillStyle = `rgb(${pixel.red}, ${pixel.green}, ${pixel.blue})`;
                    ctx.fillRect(scale(x), scale(y), scale(1), scale(1));
                }
            }
            function scale(x) {
                return x * 100 / map[0].length;
            }
        }
        function renderHeights() {
            render((cell) => {
                const intensity = cell.height * 255 / 9;
                return {
                    blue: intensity,
                    red: intensity / 2,
                    green: intensity / 2
                };
            });
        }
        function renderBasins() {
            render((cell) => {
                if (!cell.basin) {
                    return {
                        red: 255,
                        green: 255,
                        blue: 255
                    };
                }
                return {
                    red: (cell.basin % 8) * 255 / 7,
                    green: (Math.floor(cell.basin / 8) % 8) * 255 / 7,
                    blue: (Math.floor(cell.basin / 64) % 8) * 255 / 7
                };
            });
        }
        function delay(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms);
            });
        }
    });
}
