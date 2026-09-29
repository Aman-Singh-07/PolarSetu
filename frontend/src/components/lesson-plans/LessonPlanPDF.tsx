import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { LessonPlanStructure, CurriculumConcept } from '../../types';

// Register Inter static TTF fonts for clean typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
});

// Disable hyphenation breaking words unexpectedly
Font.registerHyphenationCallback(word => [word]);

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 9.5,
    lineHeight: 1.45,
    color: '#1E293B',
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#0EA5E9',
    marginBottom: 16,
  },
  headerOrg: {
    fontSize: 8,
    fontWeight: 700,
    color: '#071426',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerPlatform: {
    fontSize: 8,
    fontWeight: 700,
    color: '#0EA5E9',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  titleBlock: {
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#071426',
    marginBottom: 5,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#F0F9FF',
    color: '#0369A1',
    fontSize: 7.5,
    fontWeight: 700,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#BAE6FD',
  },
  metaText: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: 400,
  },
  sectionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CBD5E1',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#071426',
  },
  durationBadge: {
    fontSize: 7.5,
    fontWeight: 700,
    color: '#0369A1',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  bodyText: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.4,
    marginBottom: 6,
  },
  sourcesBox: {
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
  },
  sourcesLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sourceItem: {
    fontSize: 7.5,
    color: '#0284C7',
    marginBottom: 1,
  },
  qaItem: {
    marginBottom: 8,
  },
  questionText: {
    fontSize: 9,
    fontWeight: 700,
    color: '#071426',
    marginBottom: 2,
  },
  answerText: {
    fontSize: 8.5,
    color: '#334155',
    lineHeight: 1.35,
    paddingLeft: 6,
    borderLeftWidth: 1.5,
    borderLeftColor: '#BAE6FD',
  },
  expSubHeader: {
    fontSize: 8.5,
    fontWeight: 700,
    color: '#071426',
    marginTop: 5,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  bulletList: {
    paddingLeft: 8,
    marginBottom: 6,
  },
  bulletItem: {
    fontSize: 8.5,
    color: '#334155',
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: '#94A3B8',
  },
});

interface LessonPlanPDFDocProps {
  plan: LessonPlanStructure;
  concept?: CurriculumConcept | null;
  targetClass: number;
  targetSubject: string;
}

export function LessonPlanPDFDoc({
  plan,
  concept,
  targetClass,
  targetSubject,
}: LessonPlanPDFDocProps) {
  const conceptTitle = concept?.concept || 'Curriculum-Aligned Polar Science';

  return (
    <Document title={`Lesson Plan - ${conceptTitle}`} author="Aicygram">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.headerOrg}>MoES · NCPOR · Government of India</Text>
          <Text style={styles.headerPlatform}>AICYGRAM CURRICULUM SERIES</Text>
        </View>

        {/* Title & Metadata */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Lesson Plan: {conceptTitle}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.badge}>Class {targetClass}</Text>
            <Text style={styles.badge}>{targetSubject}</Text>
            {concept?.nepTags?.map((tag, idx) => (
              <Text key={idx} style={styles.badge}>
                NEP 2020: {tag}
              </Text>
            ))}
            <Text style={styles.metaText}>
              Grounded in Indian Polar Expeditions
            </Text>
          </View>
        </View>

        {/* Section 1: Teacher Brief */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>1. Teacher Brief</Text>
            <Text style={styles.durationBadge}>
              {plan.teacher_brief.duration_minutes || 5} min
            </Text>
          </View>
          <Text style={styles.bodyText}>{plan.teacher_brief.content}</Text>

          {plan.teacher_brief.sources && plan.teacher_brief.sources.length > 0 && (
            <View style={styles.sourcesBox}>
              <Text style={styles.sourcesLabel}>Sources & Evidence:</Text>
              {plan.teacher_brief.sources.map(s => (
                <Text key={s.id} style={styles.sourceItem}>
                  • [{s.id}] {s.title}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Section 2: Discussion Questions */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>2. Classroom Discussion Questions</Text>
          </View>
          {plan.discussion_questions.map((q, idx) => (
            <View key={idx} style={styles.qaItem}>
              <Text style={styles.questionText}>
                Q{idx + 1}: {q.question}
              </Text>
              <Text style={styles.answerText}>{q.answer}</Text>
              {q.sources && q.sources.length > 0 && (
                <Text style={styles.sourceItem}>
                  Source: {q.sources.map(s => `[${s.id}] ${s.title}`).join(', ')}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Section 3: Hands-On Experiment */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              3. Hands-On Experiment: {plan.experiment.title}
            </Text>
          </View>

          <Text style={styles.expSubHeader}>Materials Required:</Text>
          <View style={styles.bulletList}>
            {plan.experiment.materials.map((m, idx) => (
              <Text key={idx} style={styles.bulletItem}>
                • {m}
              </Text>
            ))}
          </View>

          <Text style={styles.expSubHeader}>Step-by-Step Procedure:</Text>
          <View style={styles.bulletList}>
            {plan.experiment.steps.map((st, idx) => (
              <Text key={idx} style={styles.bulletItem}>
                {idx + 1}. {st}
              </Text>
            ))}
          </View>

          <Text style={styles.expSubHeader}>Scientific Connection to Polar Research:</Text>
          <Text style={styles.bodyText}>{plan.experiment.connection}</Text>

          {plan.experiment.sources && plan.experiment.sources.length > 0 && (
            <View style={styles.sourcesBox}>
              <Text style={styles.sourcesLabel}>Expedition Sources:</Text>
              {plan.experiment.sources.map(s => (
                <Text key={s.id} style={styles.sourceItem}>
                  • [{s.id}] {s.title}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Aicygram · National Centre for Polar and Ocean Research (NCPOR) · aicygram.in
          </Text>
          <Text style={styles.footerText}>Licensed under CC BY 4.0</Text>
        </View>
      </Page>
    </Document>
  );
}
