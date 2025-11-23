{
    description = "Dev env for d2weaponforge";
    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs";
    };
    outputs = inputs@{ self, nixpkgs, ... }: (import ./shell.nix) { inherit nixpkgs; };
}
