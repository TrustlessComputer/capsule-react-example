import { CapsuleEthersSigner } from '@usecapsule/ethers-v6-integration';
import { ethers } from "ethers";
import { capsule } from "./capsule";

export const provider = new ethers.JsonRpcProvider('https://l2-node.regtest.trustless.computer');
export const ethersSigner = new CapsuleEthersSigner(capsule, provider as any);
