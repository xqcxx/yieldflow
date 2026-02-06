import { Cl } from "@stacks/transactions";
import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("YieldFlow Mock Vault Tests", () => {
  
  describe("Deployment", () => {
    it("initializes with zero deposits", () => {
      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-total-deposits",
        [],
        deployer
      );
      expect(result).toBeUint(0);
    });

    it("returns correct vault info", () => {
      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-vault-info",
        [],
        deployer
      );
      expect(result).toBeTuple({
        name: Cl.stringAscii("YieldFlow Mock Vault"),
        symbol: Cl.stringAscii("YF-VAULT"),
        apy: Cl.uint(1200),
        tvl: Cl.uint(0)
      });
    });

    it("returns 12% APY (1200 basis points)", () => {
      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-apy",
        [],
        deployer
      );
      expect(result).toBeUint(1200);
    });
  });

  describe("Deposits", () => {
    it("allows user to deposit", () => {
      const depositAmount = 1000000; // 1 USDCx

      const { result, events } = simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(depositAmount));
      
      // Check that receipt tokens were minted
      expect(events).toHaveLength(2);
      expect(events[0].event).toBe("ft_mint_event");
      
      // Check print event
      expect(events[1].event).toBe("print_event");
    });

    it("updates deposit record correctly", () => {
      const depositAmount = 5000000; // 5 USDCx

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-deposit-amount",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(depositAmount);
    });

    it("updates total deposits (TVL)", () => {
      const deposit1 = 1000000;
      const deposit2 = 2000000;

      simnet.callPublicFn("mock-vault", "deposit", [Cl.uint(deposit1)], wallet1);
      simnet.callPublicFn("mock-vault", "deposit", [Cl.uint(deposit2)], wallet2);

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-total-deposits",
        [],
        deployer
      );

      expect(result).toBeUint(deposit1 + deposit2);
    });

    it("mints receipt tokens to depositor", () => {
      const depositAmount = 3000000;

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-receipt-balance",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(depositAmount);
    });

    it("rejects zero amount deposits", () => {
      const { result } = simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(0)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(403)); // ERR_ZERO_AMOUNT
    });

    it("accumulates multiple deposits from same user", () => {
      const deposit1 = 1000000;
      const deposit2 = 2000000;

      simnet.callPublicFn("mock-vault", "deposit", [Cl.uint(deposit1)], wallet1);
      simnet.callPublicFn("mock-vault", "deposit", [Cl.uint(deposit2)], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-deposit-amount",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(deposit1 + deposit2);
    });
  });

  describe("Yield Simulation", () => {
    it("calculates yield correctly after blocks elapsed", () => {
      const depositAmount = 100000000; // 100 USDCx (100 * 10^6)

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      // Mine 144 blocks (~1 day worth)
      simnet.mineEmptyBlocks(144);

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-balance-with-yield",
        [Cl.principal(wallet1)],
        wallet1
      );

      // Expected yield: (100000000 * 144 * 228) / 100000000 = 328.32
      // Balance should be greater than principal
      expect(result).toBeUint(depositAmount + 32832);
    });

    it("returns correct estimated yield", () => {
      const depositAmount = 50000000; // 50 USDCx

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      // Mine some blocks
      simnet.mineEmptyBlocks(100);

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-estimated-yield",
        [Cl.principal(wallet1)],
        wallet1
      );

      // Should have some yield: (50000000 * 100 * 228) / 100000000 = 11400
      expect(result).toBeUint(11400);
    });

    it("returns zero yield for users with no deposits", () => {
      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-estimated-yield",
        [Cl.principal(wallet2)],
        wallet2
      );

      expect(result).toBeUint(0);
    });
  });

  describe("Withdrawals", () => {
    it("allows user to withdraw deposited amount", () => {
      const depositAmount = 5000000;

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "withdraw",
        [Cl.uint(depositAmount)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(depositAmount));
    });

    it("burns receipt tokens on withdrawal", () => {
      const depositAmount = 3000000;

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      simnet.callPublicFn(
        "mock-vault",
        "withdraw",
        [Cl.uint(depositAmount)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-receipt-balance",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(0);
    });

    it("updates total deposits after withdrawal", () => {
      const deposit1 = 5000000;
      const deposit2 = 3000000;
      const withdrawAmount = 2000000;

      simnet.callPublicFn("mock-vault", "deposit", [Cl.uint(deposit1)], wallet1);
      simnet.callPublicFn("mock-vault", "deposit", [Cl.uint(deposit2)], wallet2);
      simnet.callPublicFn("mock-vault", "withdraw", [Cl.uint(withdrawAmount)], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-total-deposits",
        [],
        deployer
      );

      expect(result).toBeUint(deposit1 + deposit2 - withdrawAmount);
    });

    it("rejects withdrawal with insufficient balance", () => {
      const depositAmount = 1000000;
      const withdrawAmount = 2000000;

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "withdraw",
        [Cl.uint(withdrawAmount)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(402)); // ERR_INSUFFICIENT_BALANCE
    });

    it("rejects withdrawal with zero amount", () => {
      // First deposit some amount
      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(1000000)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "withdraw",
        [Cl.uint(0)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(403)); // ERR_ZERO_AMOUNT
    });

    it("rejects withdrawal when user has no deposits", () => {
      const { result } = simnet.callPublicFn(
        "mock-vault",
        "withdraw",
        [Cl.uint(1000000)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(402)); // ERR_INSUFFICIENT_BALANCE
    });

    it("deletes deposit record when fully withdrawn", () => {
      const depositAmount = 2000000;

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      simnet.callPublicFn(
        "mock-vault",
        "withdraw",
        [Cl.uint(depositAmount)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-deposit-amount",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(0);
    });
  });

  describe("Read-only Functions", () => {
    it("returns deposit block height", () => {
      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(1000000)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-deposit-block",
        [Cl.principal(wallet1)],
        wallet1
      );

      // Should return block 3 (initial setup is block 1-2, deposit at block 3)
      expect(result).toBeUint(3);
    });

    it("returns zero for non-existent deposits", () => {
      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-deposit-amount",
        [Cl.principal(wallet2)],
        wallet2
      );

      expect(result).toBeUint(0);
    });
  });

  describe("Emergency Pause Mechanism", () => {
    it("allows owner to pause the vault", () => {
      const { result } = simnet.callPublicFn(
        "mock-vault",
        "pause",
        [],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("sets paused state to true when paused", () => {
      simnet.callPublicFn("mock-vault", "pause", [], deployer);

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "is-paused",
        [],
        deployer
      );

      expect(result).toBeBool(true);
    });

    it("rejects deposits when vault is paused", () => {
      simnet.callPublicFn("mock-vault", "pause", [], deployer);

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(1000000)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(405)); // ERR_VAULT_PAUSED
    });

    it("allows owner to unpause the vault", () => {
      simnet.callPublicFn("mock-vault", "pause", [], deployer);

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "unpause",
        [],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("allows deposits after unpausing", () => {
      simnet.callPublicFn("mock-vault", "pause", [], deployer);
      simnet.callPublicFn("mock-vault", "unpause", [], deployer);

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(1000000)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1000000));
    });

    it("rejects pause from non-owner", () => {
      const { result } = simnet.callPublicFn(
        "mock-vault",
        "pause",
        [],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(401)); // ERR_NOT_AUTHORIZED
    });

    it("rejects unpause from non-owner", () => {
      simnet.callPublicFn("mock-vault", "pause", [], deployer);

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "unpause",
        [],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(401)); // ERR_NOT_AUTHORIZED
    });
  });

  describe("Withdraw with Yield", () => {
    it("allows withdrawal with accrued yield", () => {
      const depositAmount = 100000000; // 100 USDCx

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      // Mine blocks to accrue yield
      simnet.mineEmptyBlocks(144);

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "withdraw-with-yield",
        [],
        wallet1
      );

      // Should return principal + yield
      const expectedYield = 32832; // (100000000 * 144 * 228) / 100000000
      expect(result).toBeOk(Cl.uint(depositAmount + expectedYield));
    });

    it("deletes deposit record after withdraw-with-yield", () => {
      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(5000000)],
        wallet1
      );

      simnet.mineEmptyBlocks(50);

      simnet.callPublicFn(
        "mock-vault",
        "withdraw-with-yield",
        [],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-deposit-amount",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(0);
    });

    it("burns all receipt tokens on withdraw-with-yield", () => {
      const depositAmount = 3000000;

      simnet.callPublicFn(
        "mock-vault",
        "deposit",
        [Cl.uint(depositAmount)],
        wallet1
      );

      simnet.mineEmptyBlocks(100);

      simnet.callPublicFn(
        "mock-vault",
        "withdraw-with-yield",
        [],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-receipt-balance",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeUint(0);
    });

    it("rejects withdraw-with-yield when user has no deposits", () => {
      const { result } = simnet.callPublicFn(
        "mock-vault",
        "withdraw-with-yield",
        [],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(402)); // ERR_INSUFFICIENT_BALANCE
    });

    it("updates total deposits after withdraw-with-yield", () => {
      const deposit1 = 5000000;
      const deposit2 = 3000000;

      simnet.callPublicFn("mock-vault", "deposit", [Cl.uint(deposit1)], wallet1);
      simnet.callPublicFn("mock-vault", "deposit", [Cl.uint(deposit2)], wallet2);

      simnet.mineEmptyBlocks(50);

      simnet.callPublicFn("mock-vault", "withdraw-with-yield", [], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-total-deposits",
        [],
        deployer
      );

      expect(result).toBeUint(deposit2);
    });
  });

  describe("Admin Configuration", () => {
    it("allows owner to update vault name", () => {
      const newName = "Updated Vault Name";

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "set-vault-name",
        [Cl.stringAscii(newName)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates vault name correctly", () => {
      const newName = "My Custom Vault";

      simnet.callPublicFn(
        "mock-vault",
        "set-vault-name",
        [Cl.stringAscii(newName)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-vault-info",
        [],
        deployer
      );

      expect(result).toBeTuple({
        name: Cl.stringAscii(newName),
        symbol: Cl.stringAscii("YF-VAULT"),
        apy: Cl.uint(1200),
        tvl: Cl.uint(0)
      });
    });

    it("allows owner to update vault symbol", () => {
      const newSymbol = "NEWVLT";

      const { result } = simnet.callPublicFn(
        "mock-vault",
        "set-vault-symbol",
        [Cl.stringAscii(newSymbol)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates vault symbol correctly", () => {
      const newSymbol = "CUSTOM";

      simnet.callPublicFn(
        "mock-vault",
        "set-vault-symbol",
        [Cl.stringAscii(newSymbol)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "mock-vault",
        "get-vault-info",
        [],
        deployer
      );

      expect(result).toBeTuple({
        name: Cl.stringAscii("YieldFlow Mock Vault"),
        symbol: Cl.stringAscii(newSymbol),
        apy: Cl.uint(1200),
        tvl: Cl.uint(0)
      });
    });

    it("rejects vault name update from non-owner", () => {
      const { result } = simnet.callPublicFn(
        "mock-vault",
        "set-vault-name",
        [Cl.stringAscii("Hacked Vault")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(401)); // ERR_NOT_AUTHORIZED
    });

    it("rejects vault symbol update from non-owner", () => {
      const { result } = simnet.callPublicFn(
        "mock-vault",
        "set-vault-symbol",
        [Cl.stringAscii("HACK")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(401)); // ERR_NOT_AUTHORIZED
    });
  });
});
