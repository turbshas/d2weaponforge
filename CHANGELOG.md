# Changelog

## **Name TBD** [ *1.0.1* ] Date TBD
Description TBD

* Now displays weapon description/flavor text when hovering over weapon name/icon/type.
* Adept mods no longer display on non-adept weapons.
* Changes to page loading which may improve speed slightly.
* Added toggle to display raw values for stat bonuses.
* Preferences ("Extras" area) now save across page load.
* Add show/hide button for UI elements on weapon panel to allow viewing weapon preview.

## **The Big One** [ *1.0.0* ] 2023-02-12
Starting a changelog with version 1.0.0, and listing as many features as possible here as well.

* Changes/additions to d2gunsmith include:
  * Support for all languages that are supported by the Bungie API.
  * Faster page load times and lower delay between selecting a weapon and loading it for customization.
  * Toggle of +3 stat bonuses for adept/level 20 crafted weapons.
  * Selected filters do not clear after applying them.
* Features unchanged from d2gunsmith:
  * Weapons:
    * Displays all available stats on a given weapon along with any applied modifiers, colored in red for net losses or green for net gains.
    * Selection of all 4 standard perks and origin perks, if applicable.
    * Selection of mods and display of their relevant stat bonuses.
    * Selection of any valid masterwork for a given weapon.
    * Damage falloff calculation for supported weapon types:
      * Auto rifles
      * Hand cannons
      * Pulse rifles
      * Scout rifles
      * Sidearms
      * Submachineguns
      * Fusion rifles
      * Trace rifles
      * Machine guns
    * Toggle between standard and enhanced versions of perks.
    * DIM wishlist support.
    * Show/hide retired perks on reissued weapons.
  * Filters:
    * Search by weapon name for a case-insensitive "includes text" search.
    * Filters within a category act as an "a or b", filters between category act as "a and b".
    * Filter by category: damage type.
    * Filter by category: weapon type, then archetype within that weapon type once the weapon type has been selected.
    * Filter by category: rarity.
    * Filter to include/exclude sunset weapons (exclude by default).
  * Weapon links:
    * Links to weapons on d2weaponforge are supported in the exact same format as d2gunsmith.
    * Links taken from d2gunsmith have the follow requirements:
      * Language **must** be set to English.
      * URL path (the part after the first "/") must be prefixed with `d2weaponforge/#!/`
      * The resulting link should look as follows: `{d2weaponforge website}/d2weaponforge/#!/w/{number}?s={number},{number},{number},{number},{number},{number},{number}`.

Not all features are supported at this time, work is ongoing.
