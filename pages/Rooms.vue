<template>
  <BaseBreadcrumb title="pages.rooms" />
  <BaseCard>
    <v-expansion-panels class="tw-mb-2">
      <v-expansion-panel
        title="Room 1"
      >
        <v-data-table
          item-key="id"
          :show-select="false"
          :disable-pagination="true"
          :hide-default-footer="true"
          class="page__table"
        >
          <template v-slot:body="props">
            <draggable
              :list="props.items"
              tag="tbody"
            >
              <tr
                v-for="(user, index) in props.items"
                :key="index"
              >
                <td>
                  <v-icon
                    small
                    class="page__grab-icon"
                  >
                    mdi-arrow-all
                  </v-icon>
                </td>
                <td> {{ index + 1 }} </td>
                <td> {{ user.id }} </td>
                <td> {{ user.name }} </td>
                <td> {{ user.username }} </td>
                <td> {{ user.email }} </td>
                <td> {{ user.website }} </td>
                <td>
                  <v-icon
                    small
                  >
                    mdi-pencil
                  </v-icon>
                </td>
              </tr>
            </draggable>
          </template>
        </v-data-table>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-expansion-panels>
      <v-expansion-panel
        title="Room 2"
      />
    </v-expansion-panels>
  </BaseCard>
</template>
