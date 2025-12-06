import { getContract } from "thirdweb";
import { client, BENEFITS_POOL_ADDRESS, CUSD_TOKEN_ADDRESS, activeChain } from "./thirdweb-client";
import BenefitsPoolABI from "@/abi/BenefitsPool.json";
import ERC20ABI from "@/abi/IERC20.json";

/**
 * Get the BenefitsPool contract instance
 */
export function getBenefitsPoolContract() {
  return getContract({
    client,
    chain: activeChain,
    address: BENEFITS_POOL_ADDRESS,
    abi: BenefitsPoolABI,
  });
}

/**
 * Get the cUSD token contract instance
 */
export function getCUSDContract() {
  return getContract({
    client,
    chain: activeChain,
    address: CUSD_TOKEN_ADDRESS,
    abi: ERC20ABI,
  });
}

/**
 * Contract addresses for easy import
 */
export const contracts = {
  benefitsPool: BENEFITS_POOL_ADDRESS,
  cUSD: CUSD_TOKEN_ADDRESS,
} as const;
