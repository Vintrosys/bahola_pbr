frappe.ui.form.on("Patient Encounter", {
    refresh: function (frm) {
        let section_head = frm.fields_dict.custom_life_events;
        if (!frm.fields_dict.custom_life_events.body.find('.life-event-custom-fields').length) {
            $(`<div class="life-event-custom-fields"></div>`).appendTo(frm.fields_dict.custom_life_events.body);
        } else {
            frm.fields_dict.custom_life_events.body.find('.life-event-custom-fields').html('');
        }

        if (section_head && !section_head.head.find('.add-life-event').length) {
            section_head.head.html(`
                <div>
                    ${section_head.head.html()}
                </div>
            `);
            let add_life_event_btn = $(`
                <div class="add-life-event">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" fill="var(--text-color)"/></svg>
                </div>
                `).appendTo(section_head.head);

            add_life_event_btn.css('cursor', 'pointer');
            section_head.head.css('display', 'flex');
            section_head.head.css('justify-content', 'space-between');

            add_life_event_btn.on('click', function (event) {
                event.stopPropagation?.();
                event.preventDefault?.();
                if (!(frm.doc.custom_life_events_data || []).length) {
                    frm.add_child("custom_life_events_data");
                }
                render_life_event_fields(frm, frm.add_child("custom_life_events_data"));
                refresh_field("custom_life_events_data");
            });
        }

        if (!(frm.doc.custom_life_events_data || []).length) {
            render_life_event_fields(frm);
        } else {
            frm.doc.custom_life_events_data.forEach(row => {
                render_life_event_fields(frm, row);
            });
        }

        frm.set_df_property('custom_life_events_data', 'hidden', 1);
    }
});

function render_life_event_fields(frm, data = {}) {
    let form;

    function onchange() {
        if (!data.idx) {
            if (!(frm.doc.custom_life_events_data || []).length) {
                frm.add_child('custom_life_events_data');
                refresh_field('custom_life_events_data');
            }
            data = frm.doc.custom_life_events_data[0];
        }

        ['age', 'event', 'reactions', 'illness'].forEach(field => frappe.model.set_value(data.doctype, data.name, field, form.get_value(field)));
    }
    form = new frappe.ui.FieldGroup({
        fields: [
            {
                label: "Age", fieldtype: "Int", fieldname: 'age', default: data.age, onchange: onchange
            },
            {
                fieldtype: 'Column Break', fieldname: 'col1'
            },
            {
                label: "Event", fieldtype: "Data", fieldname: 'event', default: data.event, onchange: onchange
            },
            {
                fieldtype: 'Column Break', fieldname: 'col2'
            },
            {
                label: "Reactions", fieldtype: "Data", fieldname: 'reactions', default: data.reactions, onchange: onchange
            },
            {
                fieldtype: 'Column Break', fieldname: 'col3'
            },
            {
                label: "Illness", fieldtype: "Data", fieldname: 'illness', default: data.illness, onchange: onchange
            }
        ],
        body: frm.fields_dict.custom_life_events.body.find('.life-event-custom-fields')
    });
    form.make();
}
