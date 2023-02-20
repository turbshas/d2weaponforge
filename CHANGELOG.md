# Changelog

## **Collections Filters + Perk Insights** [ *1.2.0* ] 2023-02-20
This change implements the collections filters for sources of weapons,
perk insights from community info (+ glossary) for perk details,
and some other bug fixes.

* Fixed mods not having descriptions.
* Fixed mods always showing raw stat values.
* Added Clear Filters button.
* Clear filters on search text change.
* Clear search text whenever filters are applied.
* Sort weapon filters by name.
* Sort weapon archetype filters by RPM/charge time if applicable.
* Show Crafted bonus option now hidden for non-crafted weapons.
* Added filters for seasonal weapons and various other collections (seasons prior to Season of Worthy not yet implemented).
* Insights/community info on perks added to tooltips for perks and mods.
* Glossary implemented to display list of all insights/community info.
* Fixed background image placement.

## **Improve Page Load Times + Quality of Life** [ *1.1.0* ] 2023-02-13
This change brings improvements to page load times as well as some quality of life changes such as
preferences saving across refreshes, weapon flavor text tooltip, and hiding the weapon panel UI
to view the weapon screenshot.

* Now displays weapon description/flavor text when hovering over weapon name/icon/type.
* Adept mods no longer display on non-adept weapons.
* Added toggle to display raw values for stat bonuses.
* Preferences ("Extras" area) now save across page load.
* Add show/hide button for UI elements on weapon panel to allow viewing weapon preview.
* Convert stat lookups to use index instead of stat name - removes need for translating stat names.
* Dramatically reduce bundle + asset size to improve page load time.

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
