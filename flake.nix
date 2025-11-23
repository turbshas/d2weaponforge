{
    description = "Dev env for d2weaponforge";
    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs";
    };
    outputs = inputs@{ self, nixpkgs, ... }:
    let
        system = "x86_64-linux";
        pkgs = import inputs.nixpkgs { inherit system; };
    in
    {
        devShells.${system}.default = pkgs.mkShell {
            packages = [
                pkgs.nodejs_24
            ];
            shellHook = ''
                zsh
            '';
        };
    };
}
